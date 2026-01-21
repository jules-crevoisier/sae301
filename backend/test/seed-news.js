/**
 * Script pour insérer des données de test dans la table news
 * Usage: node backend/test/seed-news.js
 */

const db = require("../db/database");
const { generateUUID } = require("../src/utils/uuid");

const sampleNews = [
  {
    title: "Saison Culturelle 2026",
    category: "CULTURE",
    content: "Découvrez la programmation de la saison culturelle 2026 avec de nombreux événements et spectacles pour toute la famille.",
    image_url: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=600&q=80",
    date: "2026-10-15",
    is_featured: 1
  },
  {
    title: "Marché de Noël",
    category: "FESTIVITÉS",
    content: "Le traditionnel marché de Noël se tiendra cette année sur la place principale avec de nombreux artisans et commerçants locaux.",
    image_url: "https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?w=600&q=80",
    date: "2026-12-12",
    is_featured: 1
  },
  {
    title: "Don du sang",
    category: "SANTÉ",
    content: "Collecte de sang organisée par l'EFS. Rendez-vous à la salle des fêtes le 20 janvier de 14h à 19h.",
    image_url: "https://images.unsplash.com/photo-1541675154750-0444c7d51e8e?w=600&q=80",
    date: "2026-01-20",
    is_featured: 1
  },
  {
    title: "Rénovation Voirie",
    category: "TRAVAUX",
    content: "Travaux de rénovation de la voirie en cours dans le centre-ville. Des déviations sont mises en place.",
    image_url: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=600&q=80",
    date: "2026-01-10",
    is_featured: 1
  },
  {
    title: "Conseil Municipal",
    category: "CITOYENNETÉ",
    content: "Prochain conseil municipal le 5 février à 19h. Ordre du jour disponible en mairie et sur le site internet.",
    image_url: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600&q=80",
    date: "2026-02-05",
    is_featured: 0
  },
  {
    title: "Calendriers de collecte",
    category: "ENVIRONNEMENT",
    content: "Les nouveaux calendriers de collecte des déchets pour l'année 2026 sont disponibles en mairie.",
    image_url: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&q=80",
    date: "2026-01-01",
    is_featured: 0
  },
  {
    title: "Enquête Publique PLU",
    category: "URBANISME",
    content: "Enquête publique relative au Plan Local d'Urbanisme (PLU) du 20 février au 20 mars 2026.",
    image_url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80",
    date: "2026-02-20",
    is_featured: 0
  },
  {
    title: "PanneauPocket",
    category: "NUMÉRIQUE",
    content: "Téléchargez l'application PanneauPocket pour recevoir les actualités de la commune directement sur votre smartphone.",
    image_url: "https://images.unsplash.com/photo-1433838552652-f9a46b332c40?w=600&q=80",
    date: "2026-01-15",
    is_featured: 0
  }
];

const seedNews = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Vérifier si la table existe
      db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='news'", (err, row) => {
        if (err) {
          console.error("Erreur vérification table:", err);
          return reject(err);
        }

        if (!row) {
          console.error("❌ La table 'news' n'existe pas. Veuillez d'abord initialiser la base de données.");
          return reject(new Error("Table news n'existe pas"));
        }

        // Supprimer les anciennes données (optionnel)
        db.run("DELETE FROM news", (err) => {
          if (err) {
            console.error("Erreur suppression données:", err);
            return reject(err);
          }

          // Insérer les nouvelles données
          const stmt = db.prepare(`
            INSERT INTO news (id, title, category, content, image_url, date, is_featured)
            VALUES (?, ?, ?, ?, ?, ?, ?)
          `);

          let completed = 0;
          const total = sampleNews.length;
          
          sampleNews.forEach((newsItem) => {
            const id = generateUUID();
            stmt.run(
              [
                id,
                newsItem.title,
                newsItem.category,
                newsItem.content,
                newsItem.image_url,
                newsItem.date,
                newsItem.is_featured
              ],
              (err) => {
                if (err) {
                  console.error(`Erreur insertion ${newsItem.title}:`, err);
                } else {
                  console.log(`✅ ${newsItem.title} inséré`);
                }
                
                completed++;
                if (completed === total) {
                  stmt.finalize((err) => {
                    if (err) {
                      console.error("Erreur finalisation:", err);
                      return reject(err);
                    }
                    console.log(`\n✅ ${total} actualités insérées avec succès`);
                    resolve();
                  });
                }
              }
            );
          });
        });
      });
    });
  });
};

// Exécuter le script
if (require.main === module) {
  seedNews()
    .then(() => {
      console.log("\n✅ Script terminé avec succès");
      process.exit(0);
    })
    .catch((err) => {
      console.error("\n❌ Erreur:", err);
      process.exit(1);
    });
}

module.exports = { seedNews };
