const db = require("../../db/database");

db.run(`
  CREATE TABLE IF NOT EXISTS cantine_inscriptions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL,
    prenom TEXT NOT NULL,
    classe TEXT NOT NULL,
    email_parent TEXT NOT NULL,
    regime_alimentaire TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

const createInscription = (data, callback) => {
  const sql = `
    INSERT INTO cantine_inscriptions
    (nom, prenom, classe, email_parent, regime_alimentaire)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.run(
    sql,
    [
      data.nom,
      data.prenom,
      data.classe,
      data.email_parent,
      data.regime_alimentaire
    ],
    callback
  );
};

const getAllInscriptions = (callback) => {
  const sql = `SELECT * FROM cantine_inscriptions ORDER BY created_at DESC`;
  db.all(sql, [], callback);
};

const getInscriptionById = (id, callback) => {
  const sql = `SELECT * FROM cantine_inscriptions WHERE id = ?`;
  db.get(sql, [id], callback);
};

const updateInscription = (id, data, callback) => {
  const sql = `
    UPDATE cantine_inscriptions
    SET nom = ?, prenom = ?, classe = ?, email_parent = ?, regime_alimentaire = ?
    WHERE id = ?
  `;
  db.run(
    sql,
    [
      data.nom,
      data.prenom,
      data.classe,
      data.email_parent,
      data.regime_alimentaire,
      id
    ],
    callback
  );
};

const deleteInscription = (id, callback) => {
  const sql = `DELETE FROM cantine_inscriptions WHERE id = ?`;
  db.run(sql, [id], callback);
};

module.exports = {
  createInscription,
  getAllInscriptions,
  getInscriptionById,
  updateInscription,
  deleteInscription
};
