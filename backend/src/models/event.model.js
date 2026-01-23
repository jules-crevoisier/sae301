/**
 * Modèle Event - Gestion des événements de la mairie
 */

const db = require("../../db/database");
const { generateUUID } = require("../utils/uuid");

/**
 * Convertit le format datetime-local en ISO si nécessaire
 * @param {string} dateStr - Date au format datetime-local ou ISO
 * @returns {string|null} Date au format ISO
 */
const formatDate = (dateStr) => {
  if (!dateStr) return null;
  // Si le format est déjà ISO, on le garde
  if (dateStr.includes('T') && dateStr.includes(':')) {
    // Format datetime-local: "YYYY-MM-DDTHH:mm" -> convertir en ISO complet
    if (dateStr.length === 16) {
      return dateStr + ':00'; // Ajouter les secondes
    }
    return dateStr;
  }
  return dateStr;
};

/**
 * Crée un nouvel événement
 * @param {Object} data - Données de l'événement
 * @param {Function} callback - Callback (err, eventId)
 */
const create = (data, callback) => {
  const id = generateUUID();
  
  const sql = `
    INSERT INTO events 
    (id, title, description, start_date, end_date, location, category, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(
    sql,
    [
      id,
      data.title,
      data.description || null,
      formatDate(data.start_date),
      formatDate(data.end_date) || formatDate(data.start_date),
      data.location || null,
      data.category || 'GENERAL',
      new Date().toISOString()
    ],
    function (err) {
      if (err) return callback(err);
      callback(null, { id });
    }
  );
};

/**
 * Récupère tous les événements
 * @param {Object} options - Options de filtrage (start_date, end_date, category)
 * @param {Function} callback
 */
const getAll = (options = {}, callback) => {
  let sql = `SELECT * FROM events WHERE 1=1`;
  const params = [];
  
  if (options.start_date) {
    sql += ` AND start_date >= ?`;
    params.push(options.start_date);
  }
  
  if (options.end_date) {
    sql += ` AND start_date <= ?`;
    params.push(options.end_date);
  }
  
  if (options.category) {
    sql += ` AND category = ?`;
    params.push(options.category);
  }
  
  sql += ` ORDER BY start_date ASC, created_at DESC`;
  
  db.all(sql, params, callback);
};

/**
 * Récupère un événement par ID
 * @param {string} id
 * @param {Function} callback
 */
const getById = (id, callback) => {
  const sql = `SELECT * FROM events WHERE id = ?`;
  db.get(sql, [id], callback);
};

/**
 * Met à jour un événement
 * @param {string} id
 * @param {Object} data
 * @param {Function} callback
 */
const update = (id, data, callback) => {
  const sql = `
    UPDATE events
    SET title = ?, description = ?, start_date = ?, end_date = ?, 
        location = ?, category = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;

  db.run(
    sql,
    [
      data.title,
      data.description || null,
      formatDate(data.start_date),
      formatDate(data.end_date) || formatDate(data.start_date),
      data.location || null,
      data.category || 'GENERAL',
      id
    ],
    callback
  );
};

/**
 * Supprime un événement
 * @param {string} id
 * @param {Function} callback
 */
const remove = (id, callback) => {
  const sql = `DELETE FROM events WHERE id = ?`;
  db.run(sql, [id], callback);
};

/**
 * Récupère les événements par catégorie
 * @param {string} category
 * @param {Function} callback
 */
const getByCategory = (category, callback) => {
  const sql = `SELECT * FROM events WHERE category = ? ORDER BY start_date ASC, created_at DESC`;
  db.all(sql, [category], callback);
};

/**
 * Récupère les événements pour une période donnée
 * @param {string} startDate - Date de début (YYYY-MM-DD)
 * @param {string} endDate - Date de fin (YYYY-MM-DD)
 * @param {Function} callback
 */
const getByDateRange = (startDate, endDate, callback) => {
  const sql = `
    SELECT * FROM events 
    WHERE start_date >= ? AND start_date <= ?
    ORDER BY start_date ASC
  `;
  db.all(sql, [startDate, endDate], callback);
};

module.exports = {
  create,
  getAll,
  getById,
  update,
  remove,
  getByCategory,
  getByDateRange
};
