/**
 * Modèle Registration - Gestion des confirmations d'inscription
 */

const db = require("../../db/database");
const { generateUUID } = require("../utils/uuid");

/**
 * Crée une confirmation d'inscription
 * @param {Object} data - { family_id, summary_json, status }
 * @param {Function} callback
 */
const create = (data, callback) => {
  const id = generateUUID();
  const sql = `
    INSERT INTO registration_confirmations 
    (id, family_id, summary_json, status)
    VALUES (?, ?, ?, ?)
  `;
  
  const summaryJson = typeof data.summary_json === "string" 
    ? data.summary_json 
    : JSON.stringify(data.summary_json);
  
  db.run(
    sql,
    [id, data.family_id, summaryJson, data.status || "CONFIRMED"],
    function (err) {
      if (err) return callback(err);
      callback(null, id);
    }
  );
};

/**
 * Récupère une confirmation par ID de famille
 * @param {string} familyId
 * @param {Function} callback
 */
const getByFamilyId = (familyId, callback) => {
  const sql = `SELECT * FROM registration_confirmations WHERE family_id = ?`;
  db.get(sql, [familyId], (err, row) => {
    if (err) return callback(err);
    if (!row) return callback(null, null);
    
    // Parse le JSON
    try {
      row.summary = JSON.parse(row.summary_json);
    } catch (e) {
      row.summary = null;
    }
    
    callback(null, row);
  });
};

/**
 * Récupère une confirmation par ID
 * @param {string} id
 * @param {Function} callback
 */
const getById = (id, callback) => {
  const sql = `SELECT * FROM registration_confirmations WHERE id = ?`;
  db.get(sql, [id], (err, row) => {
    if (err) return callback(err);
    if (!row) return callback(null, null);
    
    try {
      row.summary = JSON.parse(row.summary_json);
    } catch (e) {
      row.summary = null;
    }
    
    callback(null, row);
  });
};

/**
 * Récupère toutes les confirmations
 * @param {Object} options - { status, limit, offset }
 * @param {Function} callback
 */
const getAll = (options = {}, callback) => {
  let sql = `SELECT * FROM registration_confirmations`;
  const params = [];
  
  if (options.status) {
    sql += ` WHERE status = ?`;
    params.push(options.status);
  }
  
  sql += ` ORDER BY confirmed_at DESC`;
  
  if (options.limit) {
    sql += ` LIMIT ?`;
    params.push(options.limit);
    
    if (options.offset) {
      sql += ` OFFSET ?`;
      params.push(options.offset);
    }
  }
  
  db.all(sql, params, (err, rows) => {
    if (err) return callback(err);
    
    // Parse le JSON pour chaque ligne
    rows = rows.map(row => {
      try {
        row.summary = JSON.parse(row.summary_json);
      } catch (e) {
        row.summary = null;
      }
      return row;
    });
    
    callback(null, rows);
  });
};

/**
 * Met à jour le statut d'une confirmation
 * @param {string} id
 * @param {string} status - PENDING, CONFIRMED, CANCELLED
 * @param {Function} callback
 */
const updateStatus = (id, status, callback) => {
  const sql = `UPDATE registration_confirmations SET status = ? WHERE id = ?`;
  db.run(sql, [status, id], callback);
};

/**
 * Met à jour le résumé d'une confirmation
 * @param {string} id
 * @param {Object} summary
 * @param {Function} callback
 */
const updateSummary = (id, summary, callback) => {
  const sql = `UPDATE registration_confirmations SET summary_json = ? WHERE id = ?`;
  const summaryJson = typeof summary === "string" ? summary : JSON.stringify(summary);
  db.run(sql, [summaryJson, id], callback);
};

/**
 * Supprime une confirmation
 * @param {string} id
 * @param {Function} callback
 */
const remove = (id, callback) => {
  const sql = `DELETE FROM registration_confirmations WHERE id = ?`;
  db.run(sql, [id], callback);
};

/**
 * Vérifie si une famille a déjà une inscription confirmée
 * @param {string} familyId
 * @param {Function} callback
 */
const hasConfirmedRegistration = (familyId, callback) => {
  const sql = `
    SELECT COUNT(*) as count 
    FROM registration_confirmations 
    WHERE family_id = ? AND status = 'CONFIRMED'
  `;
  db.get(sql, [familyId], (err, row) => {
    if (err) return callback(err);
    callback(null, row.count > 0);
  });
};

module.exports = {
  create,
  getByFamilyId,
  getById,
  getAll,
  updateStatus,
  updateSummary,
  remove,
  hasConfirmedRegistration
};
