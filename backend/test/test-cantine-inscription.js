const http = require("http");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

/* ================================
   CONFIG
================================ */

const API_HOST = "localhost";
const API_PORT = 3000;
const API_PATH = "/api/cantine/inscription";

const DB_PATH = path.join(__dirname, "../db/cantine.db");

/* ================================
   DONNÉES DE TEST
================================ */

const data = JSON.stringify({
  nom: "Test",
  prenom: "Eleve",
  classe: "CM2",
  email_parent: "test.parent@mail.fr",
  regime_alimentaire: "aucun"
});

/* ================================
   TEST API POST
================================ */

const options = {
  hostname: API_HOST,
  port: API_PORT,
  path: API_PATH,
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(data)
  }
};

console.log("=================================");
console.log(" TEST API – INSCRIPTION CANTINE ");
console.log("=================================\n");

const req = http.request(options, (res) => {
  let body = "";

  console.log(`Status HTTP : ${res.statusCode}`);

  res.on("data", (chunk) => {
    body += chunk;
  });

  res.on("end", () => {
    if (res.statusCode === 201) {
      console.log("\n✅ INSCRIPTION OK");
      console.log("Réponse API :", body);
      afficherBDD();
    } else {
      console.log("\n❌ ERREUR API");
      console.log("Réponse API :", body);
    }
  });
});

req.on("error", (error) => {
  console.log("\n❌ ERREUR DE CONNEXION API");
  console.error(error.message);
});

req.write(data);
req.end();

/* ================================
   AFFICHAGE BDD
================================ */

function afficherBDD() {
  console.log("\n=================================");
  console.log(" CONTENU DE LA BASE DE DONNÉES ");
  console.log("=================================\n");

  const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
      console.error("Erreur ouverture BDD :", err.message);
      return;
    }
  });

  db.all(
    "SELECT * FROM cantine_inscriptions ORDER BY created_at DESC",
    (err, rows) => {
      if (err) {
        console.error("Erreur lecture BDD :", err.message);
        return;
      }

      if (rows.length === 0) {
        console.log("⚠️  Aucune inscription en base");
      } else {
        console.table(rows);
      }

      db.close();
    }
  );
}
