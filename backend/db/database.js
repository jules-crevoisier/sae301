const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "cantine.db");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Erreur connexion SQLite :", err.message);
  } else {
    console.log("Connexion SQLite réussie");
  }
});

module.exports = db;
