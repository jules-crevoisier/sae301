/**
 * Générateur d'UUID v4
 * Compatible Node.js sans dépendance externe
 */

const crypto = require("crypto");

/**
 * Génère un UUID v4
 * @returns {string} UUID au format standard
 */
const generateUUID = () => {
  return crypto.randomUUID();
};

/**
 * Génère un numéro de référence unique pour une famille
 * Format: FAM-YYYYMMDD-XXXX
 * @returns {string} Numéro de référence
 */
const generateFamilyReference = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  
  return `FAM-${year}${month}${day}-${random}`;
};

module.exports = {
  generateUUID,
  generateFamilyReference
};
