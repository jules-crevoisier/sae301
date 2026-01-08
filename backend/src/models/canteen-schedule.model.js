/**
 * Modèle CanteenSchedule - Gestion des jours de présence à la cantine
 */

const db = require("../../db/database");
const { generateUUID } = require("../utils/uuid");

const VALID_DAYS = ["LUNDI", "MARDI", "MERCREDI", "JEUDI", "VENDREDI"];

/**
 * Crée un planning pour un enfant
 * @param {Object} data - { child_id, day_of_week, is_present }
 * @param {Function} callback
 */
const create = (data, callback) => {
  const id = generateUUID();
  const sql = `
    INSERT INTO canteen_schedules (id, child_id, day_of_week, is_present)
    VALUES (?, ?, ?, ?)
  `;
  
  db.run(
    sql,
    [id, data.child_id, data.day_of_week, data.is_present ? 1 : 0],
    function (err) {
      if (err) return callback(err);
      callback(null, id);
    }
  );
};

/**
 * Crée un planning complet pour un enfant à partir d'une liste de jours
 * @param {Array<string>} days - Liste des jours de présence
 * @param {string} childId - ID de l'enfant
 * @param {Function} callback
 */
const createFromDays = (days, childId, callback) => {
  if (!days || days.length === 0) {
    return callback(null, []);
  }
  
  const sql = `
    INSERT INTO canteen_schedules (id, child_id, day_of_week, is_present)
    VALUES (?, ?, ?, 1)
  `;
  
  const stmt = db.prepare(sql);
  const createdIds = [];
  
  db.serialize(() => {
    days.forEach(day => {
      const id = generateUUID();
      createdIds.push(id);
      stmt.run([id, childId, day]);
    });
    
    stmt.finalize((err) => {
      if (err) return callback(err);
      callback(null, createdIds);
    });
  });
};

/**
 * Récupère le planning d'un enfant
 * @param {string} childId
 * @param {Function} callback
 */
const getByChildId = (childId, callback) => {
  const sql = `
    SELECT * FROM canteen_schedules 
    WHERE child_id = ? 
    ORDER BY CASE day_of_week
      WHEN 'LUNDI' THEN 1
      WHEN 'MARDI' THEN 2
      WHEN 'MERCREDI' THEN 3
      WHEN 'JEUDI' THEN 4
      WHEN 'VENDREDI' THEN 5
    END
  `;
  db.all(sql, [childId], callback);
};

/**
 * Récupère les jours de présence d'un enfant (format simplifié)
 * @param {string} childId
 * @param {Function} callback
 */
const getDaysByChildId = (childId, callback) => {
  const sql = `
    SELECT day_of_week FROM canteen_schedules 
    WHERE child_id = ? AND is_present = 1
    ORDER BY CASE day_of_week
      WHEN 'LUNDI' THEN 1
      WHEN 'MARDI' THEN 2
      WHEN 'MERCREDI' THEN 3
      WHEN 'JEUDI' THEN 4
      WHEN 'VENDREDI' THEN 5
    END
  `;
  db.all(sql, [childId], (err, rows) => {
    if (err) return callback(err);
    callback(null, rows.map(r => r.day_of_week));
  });
};

/**
 * Met à jour un jour du planning
 * @param {string} id
 * @param {Object} data - { is_present }
 * @param {Function} callback
 */
const update = (id, data, callback) => {
  const sql = `
    UPDATE canteen_schedules
    SET is_present = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;
  
  db.run(sql, [data.is_present ? 1 : 0, id], callback);
};

/**
 * Met à jour le planning complet d'un enfant
 * @param {Array<string>} days - Nouveaux jours de présence
 * @param {string} childId
 * @param {Function} callback
 */
const updateChildSchedule = (days, childId, callback) => {
  // Supprime l'ancien planning
  const deleteSql = `DELETE FROM canteen_schedules WHERE child_id = ?`;
  
  db.run(deleteSql, [childId], (err) => {
    if (err) return callback(err);
    
    // Crée le nouveau planning
    createFromDays(days, childId, callback);
  });
};

/**
 * Supprime un jour du planning
 * @param {string} id
 * @param {Function} callback
 */
const remove = (id, callback) => {
  const sql = `DELETE FROM canteen_schedules WHERE id = ?`;
  db.run(sql, [id], callback);
};

/**
 * Supprime tout le planning d'un enfant
 * @param {string} childId
 * @param {Function} callback
 */
const removeByChildId = (childId, callback) => {
  const sql = `DELETE FROM canteen_schedules WHERE child_id = ?`;
  db.run(sql, [childId], callback);
};

module.exports = {
  create,
  createFromDays,
  getByChildId,
  getDaysByChildId,
  update,
  updateChildSchedule,
  remove,
  removeByChildId,
  VALID_DAYS
};
