/**
 * Modèle Allergy - Gestion des allergies (référentiel + liaisons enfants)
 */

const db = require("../../db/database");
const { generateUUID } = require("../utils/uuid");

/**
 * Récupère toutes les allergies disponibles (référentiel)
 * @param {Function} callback
 */
const getAll = (callback) => {
  const sql = `SELECT * FROM allergies ORDER BY label ASC`;
  db.all(sql, [], callback);
};

/**
 * Récupère une allergie par ID
 * @param {string} id
 * @param {Function} callback
 */
const getById = (id, callback) => {
  const sql = `SELECT * FROM allergies WHERE id = ?`;
  db.get(sql, [id], callback);
};

/**
 * Crée une nouvelle allergie dans le référentiel
 * @param {string} label
 * @param {Function} callback
 */
const create = (label, callback) => {
  const id = generateUUID();
  const sql = `INSERT INTO allergies (id, label) VALUES (?, ?)`;
  
  db.run(sql, [id, label], function (err) {
    if (err) return callback(err);
    callback(null, id);
  });
};

/**
 * Associe une allergie à un enfant
 * @param {Object} data - { child_id, allergy_id, severity, comment }
 * @param {Function} callback
 */
const addToChild = (data, callback) => {
  const id = generateUUID();
  const sql = `
    INSERT INTO child_allergies (id, child_id, allergy_id, severity, comment)
    VALUES (?, ?, ?, ?, ?)
  `;
  
  db.run(
    sql,
    [id, data.child_id, data.allergy_id, data.severity, data.comment || null],
    function (err) {
      if (err) return callback(err);
      callback(null, id);
    }
  );
};

/**
 * Associe plusieurs allergies à un enfant
 * @param {Array} allergiesData - Liste des allergies à associer
 * @param {string} childId - ID de l'enfant
 * @param {Function} callback
 */
const addManyToChild = (allergiesData, childId, callback) => {
  if (!allergiesData || allergiesData.length === 0) {
    return callback(null, []);
  }
  
  const sql = `
    INSERT INTO child_allergies (id, child_id, allergy_id, severity, comment)
    VALUES (?, ?, ?, ?, ?)
  `;
  
  const stmt = db.prepare(sql);
  const createdIds = [];
  
  db.serialize(() => {
    allergiesData.forEach(allergy => {
      const id = generateUUID();
      createdIds.push(id);
      
      stmt.run([
        id,
        childId,
        allergy.allergy_id,
        allergy.severity,
        allergy.comment || null
      ]);
    });
    
    stmt.finalize((err) => {
      if (err) return callback(err);
      callback(null, createdIds);
    });
  });
};

/**
 * Récupère toutes les allergies d'un enfant
 * @param {string} childId
 * @param {Function} callback
 */
const getByChildId = (childId, callback) => {
  const sql = `
    SELECT ca.*, a.label as allergy_label
    FROM child_allergies ca
    JOIN allergies a ON ca.allergy_id = a.id
    WHERE ca.child_id = ?
    ORDER BY a.label ASC
  `;
  db.all(sql, [childId], callback);
};

/**
 * Met à jour l'allergie d'un enfant
 * @param {string} id - ID de la liaison child_allergy
 * @param {Object} data
 * @param {Function} callback
 */
const updateChildAllergy = (id, data, callback) => {
  const sql = `
    UPDATE child_allergies
    SET severity = ?, comment = ?
    WHERE id = ?
  `;
  
  db.run(sql, [data.severity, data.comment || null, id], callback);
};

/**
 * Supprime une allergie d'un enfant
 * @param {string} id - ID de la liaison child_allergy
 * @param {Function} callback
 */
const removeFromChild = (id, callback) => {
  const sql = `DELETE FROM child_allergies WHERE id = ?`;
  db.run(sql, [id], callback);
};

/**
 * Supprime toutes les allergies d'un enfant
 * @param {string} childId
 * @param {Function} callback
 */
const removeAllFromChild = (childId, callback) => {
  const sql = `DELETE FROM child_allergies WHERE child_id = ?`;
  db.run(sql, [childId], callback);
};

module.exports = {
  getAll,
  getById,
  create,
  addToChild,
  addManyToChild,
  getByChildId,
  updateChildAllergy,
  removeFromChild,
  removeAllFromChild
};
