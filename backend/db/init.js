/**
 * Initialisation de la base de données SQLite
 * Création de toutes les tables pour le système d'inscription cantine
 */

const db = require("./database");

const initDatabase = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // =============================================
      // TABLE: families (Dossier d'inscription)
      // =============================================
      db.run(`
        CREATE TABLE IF NOT EXISTS families (
          id TEXT PRIMARY KEY,
          reference_number TEXT UNIQUE NOT NULL,
          address_line1 TEXT NOT NULL,
          address_line2 TEXT,
          postal_code TEXT NOT NULL,
          city TEXT NOT NULL,
          phone_primary TEXT NOT NULL,
          phone_secondary TEXT,
          email TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // =============================================
      // TABLE: parents (Responsables légaux)
      // =============================================
      db.run(`
        CREATE TABLE IF NOT EXISTS parents (
          id TEXT PRIMARY KEY,
          family_id TEXT NOT NULL,
          first_name TEXT NOT NULL,
          last_name TEXT NOT NULL,
          email TEXT NOT NULL,
          phone TEXT NOT NULL,
          role TEXT NOT NULL CHECK(role IN ('PERE', 'MERE', 'TUTEUR')),
          salary_monthly REAL,
          social_coefficient REAL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (family_id) REFERENCES families(id) ON DELETE CASCADE
        )
      `);

      // =============================================
      // TABLE: children (Enfants)
      // =============================================
      db.run(`
        CREATE TABLE IF NOT EXISTS children (
          id TEXT PRIMARY KEY,
          family_id TEXT NOT NULL,
          first_name TEXT NOT NULL,
          last_name TEXT NOT NULL,
          birth_date DATE NOT NULL,
          school_name TEXT NOT NULL,
          class_level TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (family_id) REFERENCES families(id) ON DELETE CASCADE
        )
      `);

      // =============================================
      // TABLE: allergies (Table de référence)
      // =============================================
      db.run(`
        CREATE TABLE IF NOT EXISTS allergies (
          id TEXT PRIMARY KEY,
          label TEXT UNIQUE NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Insertion des allergies courantes
      const allergiesCommunes = [
        "Arachides",
        "Gluten",
        "Lactose",
        "Oeufs",
        "Fruits à coque",
        "Soja",
        "Poisson",
        "Crustacés",
        "Céleri",
        "Moutarde",
        "Sésame",
        "Sulfites",
        "Lupin",
        "Mollusques"
      ];

      const insertAllergyStmt = db.prepare(`
        INSERT OR IGNORE INTO allergies (id, label) VALUES (?, ?)
      `);

      allergiesCommunes.forEach((label, index) => {
        insertAllergyStmt.run(`allergy_${index + 1}`, label);
      });

      insertAllergyStmt.finalize();

      // =============================================
      // TABLE: child_allergies (Table pivot)
      // =============================================
      db.run(`
        CREATE TABLE IF NOT EXISTS child_allergies (
          id TEXT PRIMARY KEY,
          child_id TEXT NOT NULL,
          allergy_id TEXT NOT NULL,
          severity TEXT NOT NULL CHECK(severity IN ('LEGERE', 'MOYENNE', 'SEVERE')),
          comment TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE,
          FOREIGN KEY (allergy_id) REFERENCES allergies(id) ON DELETE CASCADE,
          UNIQUE(child_id, allergy_id)
        )
      `);

      // =============================================
      // TABLE: canteen_schedules (Jours de présence)
      // =============================================
      db.run(`
        CREATE TABLE IF NOT EXISTS canteen_schedules (
          id TEXT PRIMARY KEY,
          child_id TEXT NOT NULL,
          day_of_week TEXT NOT NULL CHECK(day_of_week IN ('LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI')),
          is_present INTEGER NOT NULL DEFAULT 1,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE,
          UNIQUE(child_id, day_of_week)
        )
      `);

      // =============================================
      // TABLE: pricing_results (Tarification calculée)
      // =============================================
      db.run(`
        CREATE TABLE IF NOT EXISTS pricing_results (
          id TEXT PRIMARY KEY,
          family_id TEXT NOT NULL,
          social_coefficient_used REAL NOT NULL,
          price_per_meal REAL NOT NULL,
          estimated_monthly_price REAL NOT NULL,
          calculated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (family_id) REFERENCES families(id) ON DELETE CASCADE
        )
      `);

      // =============================================
      // TABLE: registration_confirmations (Confirmation finale)
      // =============================================
      db.run(`
        CREATE TABLE IF NOT EXISTS registration_confirmations (
          id TEXT PRIMARY KEY,
          family_id TEXT NOT NULL UNIQUE,
          summary_json TEXT NOT NULL,
          status TEXT NOT NULL DEFAULT 'CONFIRMED' CHECK(status IN ('PENDING', 'CONFIRMED', 'CANCELLED')),
          confirmed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (family_id) REFERENCES families(id) ON DELETE CASCADE
        )
      `);

      // =============================================
      // TABLE: news (Actualités)
      // =============================================
      db.run(`
        CREATE TABLE IF NOT EXISTS news (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          category TEXT NOT NULL,
          content TEXT,
          image_url TEXT,
          date TEXT NOT NULL,
          is_featured INTEGER DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) {
          console.error("Erreur initialisation BDD:", err.message);
          reject(err);
        } else {
          console.log("✅ Base de données initialisée avec succès");
          resolve();
        }
      });

      // =============================================
      // INDEX pour optimisation des requêtes
      // =============================================
      db.run(`CREATE INDEX IF NOT EXISTS idx_parents_family ON parents(family_id)`);
      db.run(`CREATE INDEX IF NOT EXISTS idx_children_family ON children(family_id)`);
      db.run(`CREATE INDEX IF NOT EXISTS idx_child_allergies_child ON child_allergies(child_id)`);
      db.run(`CREATE INDEX IF NOT EXISTS idx_canteen_schedules_child ON canteen_schedules(child_id)`);
      db.run(`CREATE INDEX IF NOT EXISTS idx_pricing_family ON pricing_results(family_id)`);
      db.run(`CREATE INDEX IF NOT EXISTS idx_families_reference ON families(reference_number)`);
      db.run(`CREATE INDEX IF NOT EXISTS idx_families_email ON families(email)`);
      db.run(`CREATE INDEX IF NOT EXISTS idx_news_date ON news(date)`);
      db.run(`CREATE INDEX IF NOT EXISTS idx_news_featured ON news(is_featured)`);
    });
  });
};

module.exports = { initDatabase };
