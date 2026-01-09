/**
 * Modèle Child - Gestion des enfants
 */

const db = require("../../db/database");
const { generateUUID } = require("../utils/uuid");

/**
 * Crée un nouvel enfant
 * @param {Object} data - Données de l'enfant
 * @param {Function} callback - Callback (err, childId)
 */
const create = (data, callback) => {
  const id = generateUUID();
  
  const sql = `
    INSERT INTO children 
    (id, family_id, first_name, last_name, birth_date, school_name, class_level)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  
  db.run(
    sql,
    [
      id,
      data.family_id,
      data.first_name,
      data.last_name,
      data.birth_date,
      data.school_name,
      data.class_level
    ],
    function (err) {
      if (err) return callback(err);
      callback(null, id);
    }
  );
};

/**
 * Crée plusieurs enfants en une transaction
 * @param {Array} childrenData - Liste des enfants
 * @param {string} familyId - ID de la famille
 * @param {Function} callback
 */
const createMany = (childrenData, familyId, callback) => {
  const sql = `
    INSERT INTO children 
    (id, family_id, first_name, last_name, birth_date, school_name, class_level)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  
  const stmt = db.prepare(sql);
  const createdIds = [];
  
  db.serialize(() => {
    childrenData.forEach(child => {
      const id = generateUUID();
      createdIds.push(id);
      
      const info = child.info || child;
      
      stmt.run([
        id,
        familyId,
        info.first_name,
        info.last_name,
        info.birth_date,
        info.school_name,
        info.class_level
      ]);
    });
    
    stmt.finalize((err) => {
      if (err) return callback(err);
      callback(null, createdIds);
    });
  });
};

/**
 * Récupère tous les enfants d'une famille
 * @param {string} familyId
 * @param {Function} callback
 */
const getByFamilyId = (familyId, callback) => {
  const sql = `SELECT * FROM children WHERE family_id = ? ORDER BY birth_date ASC`;
  db.all(sql, [familyId], callback);
};

/**
 * Récupère un enfant par ID
 * @param {string} id
 * @param {Function} callback
 */
const getById = (id, callback) => {
  const sql = `SELECT * FROM children WHERE id = ?`;
  db.get(sql, [id], callback);
};

/**
 * Récupère un enfant avec ses allergies et planning
 * @param {string} id
 * @param {Function} callback
 */
const getFullChild = (id, callback) => {
  const childSql = `SELECT * FROM children WHERE id = ?`;
  const allergiesSql = `
    SELECT ca.*, a.label as allergy_label 
    FROM child_allergies ca
    JOIN allergies a ON ca.allergy_id = a.id
    WHERE ca.child_id = ?
  `;
  const scheduleSql = `SELECT * FROM canteen_schedules WHERE child_id = ?`;
  
  db.get(childSql, [id], (err, child) => {
    if (err) return callback(err);
    if (!child) return callback(null, null);
    
    db.all(allergiesSql, [id], (err, allergies) => {
      if (err) return callback(err);
      
      db.all(scheduleSql, [id], (err, schedule) => {
        if (err) return callback(err);
        
        callback(null, {
          ...child,
          allergies,
          canteen_schedule: schedule
        });
      });
    });
  });
};

/**
 * Met à jour un enfant
 * @param {string} id
 * @param {Object} data
 * @param {Function} callback
 */
const update = (id, data, callback) => {
  const sql = `
    UPDATE children
    SET first_name = ?, last_name = ?, birth_date = ?, school_name = ?, 
        class_level = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;
  
  db.run(
    sql,
    [
      data.first_name,
      data.last_name,
      data.birth_date,
      data.school_name,
      data.class_level,
      id
    ],
    callback
  );
};

/**
 * Supprime un enfant (CASCADE supprime allergies et planning)
 * @param {string} id
 * @param {Function} callback
 */
const remove = (id, callback) => {
  const sql = `DELETE FROM children WHERE id = ?`;
  db.run(sql, [id], callback);
};

/**
 * Supprime tous les enfants d'une famille
 * @param {string} familyId
 * @param {Function} callback
 */
const removeByFamilyId = (familyId, callback) => {
  const sql = `DELETE FROM children WHERE family_id = ?`;
  db.run(sql, [familyId], callback);
};

module.exports = {
  create,
  createMany,
  getByFamilyId,
  getById,
  getFullChild,
  update,
  remove,
  removeByFamilyId
};
