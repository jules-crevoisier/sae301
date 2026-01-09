/**
 * Modèle Pricing - Gestion des résultats de tarification
 */

const db = require("../../db/database");
const { generateUUID } = require("../utils/uuid");

/**
 * Crée un nouveau résultat de tarification
 * @param {Object} data - Données de tarification
 * @param {Function} callback
 */
const create = (data, callback) => {
  const id = generateUUID();
  const sql = `
    INSERT INTO pricing_results 
    (id, family_id, social_coefficient_used, price_per_meal, estimated_monthly_price)
    VALUES (?, ?, ?, ?, ?)
  `;
  
  db.run(
    sql,
    [
      id,
      data.family_id,
      data.social_coefficient_used,
      data.price_per_meal,
      data.estimated_monthly_price
    ],
    function (err) {
      if (err) return callback(err);
      callback(null, id);
    }
  );
};

/**
 * Récupère tous les résultats de tarification d'une famille
 * @param {string} familyId
 * @param {Function} callback
 */
const getByFamilyId = (familyId, callback) => {
  const sql = `
    SELECT * FROM pricing_results 
    WHERE family_id = ? 
    ORDER BY calculated_at DESC
  `;
  db.all(sql, [familyId], callback);
};

/**
 * Récupère le dernier résultat de tarification d'une famille
 * @param {string} familyId
 * @param {Function} callback
 */
const getLatestByFamilyId = (familyId, callback) => {
  const sql = `
    SELECT * FROM pricing_results 
    WHERE family_id = ? 
    ORDER BY calculated_at DESC
    LIMIT 1
  `;
  db.get(sql, [familyId], callback);
};

/**
 * Récupère un résultat de tarification par ID
 * @param {string} id
 * @param {Function} callback
 */
const getById = (id, callback) => {
  const sql = `SELECT * FROM pricing_results WHERE id = ?`;
  db.get(sql, [id], callback);
};

/**
 * Supprime un résultat de tarification
 * @param {string} id
 * @param {Function} callback
 */
const remove = (id, callback) => {
  const sql = `DELETE FROM pricing_results WHERE id = ?`;
  db.run(sql, [id], callback);
};

/**
 * Supprime tous les résultats de tarification d'une famille
 * @param {string} familyId
 * @param {Function} callback
 */
const removeByFamilyId = (familyId, callback) => {
  const sql = `DELETE FROM pricing_results WHERE family_id = ?`;
  db.run(sql, [familyId], callback);
};

module.exports = {
  create,
  getByFamilyId,
  getLatestByFamilyId,
  getById,
  remove,
  removeByFamilyId
};
