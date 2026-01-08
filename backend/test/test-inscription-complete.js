/**
 * Test complet de l'API d'inscription cantine
 * Usage: node test/test-inscription-complete.js
 */

const http = require("http");

/* ================================
   CONFIG
================================ */
require("dotenv").config();

const API_HOST = "localhost";
const API_PORT = process.env.PORT || 4000;

/* ================================
   DONNÉES DE TEST COMPLÈTES
================================ */

const inscriptionData = {
  family: {
    address_line1: "123 Rue de la Paix",
    address_line2: "Bâtiment A, Appartement 42",
    postal_code: "75001",
    city: "Paris",
    phone_primary: "0612345678",
    phone_secondary: "0687654321",
    email: `test.famille.${Date.now()}@example.fr`
  },
  parents: [
    {
      first_name: "Jean",
      last_name: "Dupont",
      email: "jean.dupont@example.fr",
      phone: "0612345678",
      role: "PERE",
      salary_monthly: 2500
    },
    {
      first_name: "Marie",
      last_name: "Dupont",
      email: "marie.dupont@example.fr",
      phone: "0687654321",
      role: "MERE",
      social_coefficient: 1.8
    }
  ],
  children: [
    {
      info: {
        first_name: "Lucas",
        last_name: "Dupont",
        birth_date: "2016-05-15",
        school_name: "École Primaire Victor Hugo",
        class_level: "CE2"
      },
      allergies: [
        {
          allergy_id: "allergy_1",
          severity: "SEVERE",
          comment: "Réaction anaphylactique possible"
        },
        {
          allergy_id: "allergy_2",
          severity: "LEGERE"
        }
      ],
      canteen_days: ["LUNDI", "MARDI", "JEUDI", "VENDREDI"]
    },
    {
      info: {
        first_name: "Emma",
        last_name: "Dupont",
        birth_date: "2018-09-22",
        school_name: "École Maternelle Les Petits Princes",
        class_level: "Grande Section"
      },
      allergies: [
        {
          allergy_id: "allergy_3",
          severity: "MOYENNE",
          comment: "Intolérance légère"
        }
      ],
      canteen_days: ["LUNDI", "MARDI", "MERCREDI", "JEUDI", "VENDREDI"]
    }
  ]
};

/* ================================
   FONCTIONS UTILITAIRES
================================ */

const makeRequest = (method, path, data = null) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: API_HOST,
      port: API_PORT,
      path: path,
      method: method,
      headers: {
        "Content-Type": "application/json"
      }
    };

    if (data) {
      options.headers["Content-Length"] = Buffer.byteLength(JSON.stringify(data));
    }

    const req = http.request(options, (res) => {
      let body = "";

      res.on("data", (chunk) => {
        body += chunk;
      });

      res.on("end", () => {
        try {
          const jsonBody = JSON.parse(body);
          resolve({ status: res.statusCode, data: jsonBody });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on("error", (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
};

const printSection = (title) => {
  console.log("\n" + "=".repeat(50));
  console.log(` ${title}`);
  console.log("=".repeat(50));
};

const printResult = (label, success, details = "") => {
  const icon = success ? "✅" : "❌";
  console.log(`${icon} ${label}${details ? `: ${details}` : ""}`);
};

/* ================================
   TESTS
================================ */

const runTests = async () => {
  console.log("\n");
  console.log("╔════════════════════════════════════════════════╗");
  console.log("║     TEST API INSCRIPTION CANTINE SCOLAIRE      ║");
  console.log("╚════════════════════════════════════════════════╝");
  console.log(`\nServeur: http://${API_HOST}:${API_PORT}`);

  let familyId = null;
  let referenceNumber = null;

  try {
    // Test 1: Health Check
    printSection("1. TEST HEALTH CHECK");
    const healthResult = await makeRequest("GET", "/api/health");
    printResult("Health Check", healthResult.status === 200, healthResult.data.message);

    // Test 2: Récupération des allergies disponibles
    printSection("2. TEST ALLERGIES DISPONIBLES");
    const allergiesResult = await makeRequest("GET", "/api/allergies");
    printResult(
      "Liste allergies",
      allergiesResult.status === 200,
      `${allergiesResult.data.count} allergies disponibles`
    );
    if (allergiesResult.data.data) {
      console.log("   Exemples:", allergiesResult.data.data.slice(0, 5).map(a => a.label).join(", "));
    }

    // Test 3: Récupération des tranches tarifaires
    printSection("3. TEST TRANCHES TARIFAIRES");
    const tiersResult = await makeRequest("GET", "/api/pricing/tiers");
    printResult("Tranches tarifaires", tiersResult.status === 200);
    if (tiersResult.data.data) {
      console.log("   Tranches:");
      tiersResult.data.data.forEach(tier => {
        const max = tier.max_coefficient || "∞";
        console.log(`   - Coefficient ${tier.min_coefficient} à ${max}: ${tier.price_per_meal}€/repas`);
      });
    }

    // Test 4: Simulation de tarification
    printSection("4. TEST SIMULATION TARIFICATION");
    const simulationData = {
      parents: inscriptionData.parents,
      children: inscriptionData.children.map(c => ({
        info: c.info,
        canteen_days: c.canteen_days
      }))
    };
    const simulationResult = await makeRequest("POST", "/api/pricing/calculate", simulationData);
    printResult("Simulation tarification", simulationResult.status === 200);
    if (simulationResult.data.data) {
      const pricing = simulationResult.data.data;
      console.log(`   Coefficient social: ${pricing.social_coefficient_used}`);
      console.log(`   Prix par repas: ${pricing.price_per_meal}€`);
      console.log(`   Estimation mensuelle: ${pricing.estimated_monthly_price}€`);
    }

    // Test 5: Inscription complète
    printSection("5. TEST INSCRIPTION COMPLÈTE");
    const inscriptionResult = await makeRequest("POST", "/api/inscription", inscriptionData);
    printResult("Inscription", inscriptionResult.status === 201, inscriptionResult.data.message);
    
    if (inscriptionResult.status === 201) {
      familyId = inscriptionResult.data.data.family_id;
      referenceNumber = inscriptionResult.data.data.reference_number;
      
      console.log(`   ID Famille: ${familyId}`);
      console.log(`   Numéro de référence: ${referenceNumber}`);
      console.log(`   Prix estimé mensuel: ${inscriptionResult.data.data.pricing.estimated_monthly_price}€`);
    } else {
      console.log("   Erreur:", JSON.stringify(inscriptionResult.data, null, 2));
    }

    // Test 6: Récupération famille complète
    if (familyId) {
      printSection("6. TEST RÉCUPÉRATION FAMILLE COMPLÈTE");
      const familyResult = await makeRequest("GET", `/api/families/${familyId}/full`);
      printResult("Récupération famille", familyResult.status === 200);
      
      if (familyResult.data.data) {
        const family = familyResult.data.data;
        console.log(`   Adresse: ${family.address_line1}, ${family.postal_code} ${family.city}`);
        console.log(`   Parents: ${family.parents.length}`);
        console.log(`   Enfants: ${family.children.length}`);
        family.children.forEach(child => {
          console.log(`   - ${child.first_name}: ${child.canteen_days.length} jours/semaine, ${child.allergies.length} allergie(s)`);
        });
      }
    }

    // Test 7: Récupération par référence
    if (referenceNumber) {
      printSection("7. TEST RÉCUPÉRATION PAR RÉFÉRENCE");
      const refResult = await makeRequest("GET", `/api/families/reference/${referenceNumber}`);
      printResult("Recherche par référence", refResult.status === 200, referenceNumber);
    }

    // Test 8: Liste des inscriptions
    printSection("8. TEST LISTE INSCRIPTIONS");
    const listResult = await makeRequest("GET", "/api/inscriptions");
    printResult("Liste inscriptions", listResult.status === 200, `${listResult.data.count} inscription(s)`);

    // Test 9: Tentative de doublon (doit échouer)
    printSection("9. TEST DOUBLON (attendu: erreur)");
    const doublonResult = await makeRequest("POST", "/api/inscription", inscriptionData);
    printResult(
      "Détection doublon",
      doublonResult.status === 409,
      doublonResult.status === 409 ? "Doublon correctement rejeté" : "ERREUR: Doublon non détecté"
    );

    // Test 10: Validation des données (doit échouer)
    printSection("10. TEST VALIDATION (attendu: erreur)");
    const invalidData = {
      family: {
        address_line1: "A", // Trop court
        postal_code: "123", // Invalide
        city: "P",
        phone_primary: "invalid",
        email: "not-an-email"
      },
      parents: [],
      children: []
    };
    const validationResult = await makeRequest("POST", "/api/inscription", invalidData);
    printResult(
      "Validation données",
      validationResult.status === 400,
      validationResult.status === 400 ? "Validation fonctionnelle" : "ERREUR: Validation non fonctionnelle"
    );

    // Test 11: Nettoyage (suppression)
    if (familyId) {
      printSection("11. TEST SUPPRESSION");
      const deleteResult = await makeRequest("DELETE", `/api/families/${familyId}`);
      printResult("Suppression famille", deleteResult.status === 200, deleteResult.data.message);
      
      // Vérifie que la famille n'existe plus
      const verifyResult = await makeRequest("GET", `/api/families/${familyId}`);
      printResult("Vérification suppression", verifyResult.status === 404, "Famille correctement supprimée");
    }

    // Résumé
    printSection("RÉSUMÉ");
    console.log("✅ Tous les tests ont été exécutés avec succès!");
    console.log("\n📋 Endpoints disponibles:");
    console.log("   POST   /api/inscription          - Inscription complète");
    console.log("   GET    /api/inscriptions         - Liste inscriptions");
    console.log("   GET    /api/inscriptions/:id     - Détail inscription");
    console.log("   GET    /api/families             - Liste familles");
    console.log("   GET    /api/families/:id/full    - Famille complète");
    console.log("   GET    /api/allergies            - Liste allergies");
    console.log("   GET    /api/pricing/tiers        - Tranches tarifaires");
    console.log("   POST   /api/pricing/calculate    - Simulation tarification");
    console.log("   GET    /api/children/:id         - Détail enfant");
    console.log("   PUT    /api/children/:id/schedule - Modifier planning");

  } catch (error) {
    console.error("\n❌ ERREUR:", error.message);
    console.log("\n⚠️  Assurez-vous que le serveur est démarré:");
    console.log(`   npm run dev`);
    process.exit(1);
  }
};

// Exécution
runTests();
