/**
 * Modèle Parent - Gestion des parents/responsables légaux
 */

const db = require("../../db/database");
const { generateUUID } = require("../utils/uuid");

/**
 * Crée un nouveau parent
 * @param {Object} data - Données du parent
 * @param {Function} callback - Callback (err, parentId)
 */
const create = (data, callback) => {
  const id = generateUUID();
  
  const sql = `
    INSERT INTO parents 
    (id, family_id, first_name, last_name, email, phone, role, salary_monthly, social_coefficient)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  db.run(
    sql,
    [
      id,
      data.family_id,
      data.first_name,
      data.last_name,
      data.email,
      data.phone,
      data.role,
      data.salary_monthly || null,
      data.social_coefficient || null
    ],
    function (err) {
      if (err) return callback(err);
      callback(null, id);
    }
  );
};

/**
 * Crée plusieurs parents en une transaction
 * @param {Array} parentsData - Liste des parents
 * @param {string} familyId - ID de la famille
 * @param {Function} callback
 */
const createMany = (parentsData, familyId, callback) => {
  const sql = `
    INSERT INTO parents 
    (id, family_id, first_name, last_name, email, phone, role, salary_monthly, social_coefficient)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  const stmt = db.prepare(sql);
  const createdIds = [];
  
  db.serialize(() => {
    parentsData.forEach(parent => {
      const id = generateUUID();
      createdIds.push(id);
      
      stmt.run([
        id,
        familyId,
        parent.first_name,
        parent.last_name,
        parent.email,
        parent.phone,
        parent.role,
        parent.salary_monthly || null,
        parent.social_coefficient || null
      ]);
    });
    
    stmt.finalize((err) => {
      if (err) return callback(err);
      callback(null, createdIds);
    });
  });
};

/**
 * Récupère tous les parents d'une famille
 * @param {string} familyId
 * @param {Function} callback
 */
const getByFamilyId = (familyId, callback) => {
  const sql = `SELECT * FROM parents WHERE family_id = ? ORDER BY created_at ASC`;
  db.all(sql, [familyId], callback);
};

/**
 * Récupère un parent par ID
 * @param {string} id
 * @param {Function} callback
 */
const getById = (id, callback) => {
  const sql = `SELECT * FROM parents WHERE id = ?`;
  db.get(sql, [id], callback);
};

/**
 * Met à jour un parent
 * @param {string} id
 * @param {Object} data
 * @param {Function} callback
 */
const update = (id, data, callback) => {
  const sql = `
    UPDATE parents
    SET first_name = ?, last_name = ?, email = ?, phone = ?, role = ?, 
        salary_monthly = ?, social_coefficient = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;
  
  db.run(
    sql,
    [
      data.first_name,
      data.last_name,
      data.email,
      data.phone,
      data.role,
      data.salary_monthly || null,
      data.social_coefficient || null,
      id
    ],
    callback
  );
};

/**
 * Supprime un parent
 * @param {string} id
 * @param {Function} callback
 */
const remove = (id, callback) => {
  const sql = `DELETE FROM parents WHERE id = ?`;
  db.run(sql, [id], callback);
};

/**
 * Supprime tous les parents d'une famille
 * @param {string} familyId
 * @param {Function} callback
 */
const removeByFamilyId = (familyId, callback) => {
  const sql = `DELETE FROM parents WHERE family_id = ?`;
  db.run(sql, [familyId], callback);
};

module.exports = {
  create,
  createMany,
  getByFamilyId,
  getById,
  update,
  remove,
  removeByFamilyId
};
