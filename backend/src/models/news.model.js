/**
 * Modèle News - Gestion des actualités
 */

const db = require("../../db/database");
const { generateUUID } = require("../utils/uuid");

/**
 * Crée une nouvelle actualité
 * @param {Object} data - Données de l'actualité
 * @param {Function} callback - Callback (err, newsId)
 */
const create = (data, callback) => {
  const id = generateUUID();
  
  const sql = `
    INSERT INTO news 
    (id, title, category, content, image_url, date, is_featured)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  
  db.run(
    sql,
    [
      id,
      data.title,
      data.category,
      data.content || null,
      data.image_url || null,
      data.date,
      data.is_featured ? 1 : 0
    ],
    function (err) {
      if (err) return callback(err);
      callback(null, { id });
    }
  );
};

/**
 * Récupère toutes les actualités
 * @param {Object} options - Options de filtrage (limit, featured, category)
 * @param {Function} callback
 */
const getAll = (options = {}, callback) => {
  let sql = `SELECT * FROM news WHERE 1=1`;
  const params = [];
  
  if (options.featured !== undefined) {
    sql += ` AND is_featured = ?`;
    params.push(options.featured ? 1 : 0);
  }
  
  if (options.category) {
    sql += ` AND category = ?`;
    params.push(options.category);
  }
  
  sql += ` ORDER BY date DESC, created_at DESC`;
  
  if (options.limit) {
    sql += ` LIMIT ?`;
    params.push(options.limit);
  }
  
  db.all(sql, params, callback);
};

/**
 * Récupère une actualité par ID
 * @param {string} id
 * @param {Function} callback
 */
const getById = (id, callback) => {
  const sql = `SELECT * FROM news WHERE id = ?`;
  db.get(sql, [id], callback);
};

/**
 * Met à jour une actualité
 * @param {string} id
 * @param {Object} data
 * @param {Function} callback
 */
const update = (id, data, callback) => {
  const sql = `
    UPDATE news
    SET title = ?, category = ?, content = ?, image_url = ?, 
        date = ?, is_featured = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;
  
  db.run(
    sql,
    [
      data.title,
      data.category,
      data.content || null,
      data.image_url || null,
      data.date,
      data.is_featured ? 1 : 0,
      id
    ],
    callback
  );
};

/**
 * Supprime une actualité
 * @param {string} id
 * @param {Function} callback
 */
const remove = (id, callback) => {
  const sql = `DELETE FROM news WHERE id = ?`;
  db.run(sql, [id], callback);
};

/**
 * Récupère les actualités par catégorie
 * @param {string} category
 * @param {Function} callback
 */
const getByCategory = (category, callback) => {
  const sql = `SELECT * FROM news WHERE category = ? ORDER BY date DESC, created_at DESC`;
  db.all(sql, [category], callback);
};

module.exports = {
  create,
  getAll,
  getById,
  update,
  remove,
  getByCategory
};
