require("dotenv").config();
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbName = process.env.DB_NAME || "cantine.db";
const dbPath = path.join(__dirname, dbName);

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Erreur connexion SQLite :", err.message);
  } else {
    console.log(`SQLite connecté : ${dbName}`);
  }
});

module.exports = db;
