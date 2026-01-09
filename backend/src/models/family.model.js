/**
 * Modèle Family - Gestion des familles (dossiers d'inscription)
 */

const db = require("../../db/database");
const { generateUUID, generateFamilyReference } = require("../utils/uuid");

/**
 * Crée une nouvelle famille
 * @param {Object} data - Données de la famille
 * @param {Function} callback - Callback (err, familyId)
 */
const create = (data, callback) => {
  const id = generateUUID();
  const referenceNumber = generateFamilyReference();
  
  const sql = `
    INSERT INTO families 
    (id, reference_number, address_line1, address_line2, postal_code, city, phone_primary, phone_secondary, email)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  db.run(
    sql,
    [
      id,
      referenceNumber,
      data.address_line1,
      data.address_line2 || null,
      data.postal_code,
      data.city,
      data.phone_primary,
      data.phone_secondary || null,
      data.email
    ],
    function (err) {
      if (err) return callback(err);
      callback(null, { id, reference_number: referenceNumber });
    }
  );
};

/**
 * Récupère toutes les familles
 * @param {Function} callback
 */
const getAll = (callback) => {
  const sql = `SELECT * FROM families ORDER BY created_at DESC`;
  db.all(sql, [], callback);
};

/**
 * Récupère une famille par ID
 * @param {string} id
 * @param {Function} callback
 */
const getById = (id, callback) => {
  const sql = `SELECT * FROM families WHERE id = ?`;
  db.get(sql, [id], callback);
};

/**
 * Récupère une famille par numéro de référence
 * @param {string} referenceNumber
 * @param {Function} callback
 */
const getByReference = (referenceNumber, callback) => {
  const sql = `SELECT * FROM families WHERE reference_number = ?`;
  db.get(sql, [referenceNumber], callback);
};

/**
 * Récupère une famille par email
 * @param {string} email
 * @param {Function} callback
 */
const getByEmail = (email, callback) => {
  const sql = `SELECT * FROM families WHERE email = ?`;
  db.get(sql, [email], callback);
};

/**
 * Met à jour une famille
 * @param {string} id
 * @param {Object} data
 * @param {Function} callback
 */
const update = (id, data, callback) => {
  const sql = `
    UPDATE families
    SET address_line1 = ?, address_line2 = ?, postal_code = ?, city = ?, 
        phone_primary = ?, phone_secondary = ?, email = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;
  
  db.run(
    sql,
    [
      data.address_line1,
      data.address_line2 || null,
      data.postal_code,
      data.city,
      data.phone_primary,
      data.phone_secondary || null,
      data.email,
      id
    ],
    callback
  );
};

/**
 * Supprime une famille et toutes ses données associées (CASCADE)
 * @param {string} id
 * @param {Function} callback
 */
const remove = (id, callback) => {
  const sql = `DELETE FROM families WHERE id = ?`;
  db.run(sql, [id], callback);
};

/**
 * Récupère une famille complète avec tous ses membres
 * @param {string} familyId
 * @param {Function} callback
 */
const getFullFamily = (familyId, callback) => {
  const familySql = `SELECT * FROM families WHERE id = ?`;
  const parentsSql = `SELECT * FROM parents WHERE family_id = ?`;
  const childrenSql = `SELECT * FROM children WHERE family_id = ?`;
  
  db.get(familySql, [familyId], (err, family) => {
    if (err) return callback(err);
    if (!family) return callback(null, null);
    
    db.all(parentsSql, [familyId], (err, parents) => {
      if (err) return callback(err);
      
      db.all(childrenSql, [familyId], (err, children) => {
        if (err) return callback(err);
        
        callback(null, {
          ...family,
          parents,
          children
        });
      });
    });
  });
};

module.exports = {
  create,
  getAll,
  getById,
  getByReference,
  getByEmail,
  update,
  remove,
  getFullFamily
};
