/**
 * Utilitaires de validation des données
 */

const VALID_ROLES = ["PERE", "MERE", "TUTEUR"];
const VALID_DAYS = ["LUNDI", "MARDI", "MERCREDI", "JEUDI", "VENDREDI"];
const VALID_SEVERITIES = ["LEGERE", "MOYENNE", "SEVERE"];

/**
 * Valide un email
 * @param {string} email
 * @returns {boolean}
 */
const isValidEmail = (email) => {
  if (!email || typeof email !== "string") return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valide un numéro de téléphone français
 * @param {string} phone
 * @returns {boolean}
 */
const isValidPhone = (phone) => {
  if (!phone || typeof phone !== "string") return false;
  // Supprime les espaces et tirets
  const cleaned = phone.replace(/[\s\-\.]/g, "");
  // Accepte les formats: 0612345678, +33612345678, 0033612345678
  const phoneRegex = /^(?:(?:\+|00)33|0)[1-9](?:[0-9]{8})$/;
  return phoneRegex.test(cleaned);
};

/**
 * Valide un code postal français
 * @param {string} postalCode
 * @returns {boolean}
 */
const isValidPostalCode = (postalCode) => {
  if (!postalCode || typeof postalCode !== "string") return false;
  const postalRegex = /^[0-9]{5}$/;
  return postalRegex.test(postalCode);
};

/**
 * Valide une date de naissance
 * @param {string} dateStr - Date au format YYYY-MM-DD
 * @returns {boolean}
 */
const isValidBirthDate = (dateStr) => {
  if (!dateStr || typeof dateStr !== "string") return false;
  
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateStr)) return false;
  
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return false;
  
  const today = new Date();
  const minDate = new Date();
  minDate.setFullYear(today.getFullYear() - 25); // Enfant max 25 ans
  
  return date <= today && date >= minDate;
};

/**
 * Valide le rôle d'un parent
 * @param {string} role
 * @returns {boolean}
 */
const isValidRole = (role) => {
  return VALID_ROLES.includes(role);
};

/**
 * Valide un jour de la semaine
 * @param {string} day
 * @returns {boolean}
 */
const isValidDay = (day) => {
  return VALID_DAYS.includes(day);
};

/**
 * Valide la sévérité d'une allergie
 * @param {string} severity
 * @returns {boolean}
 */
const isValidSeverity = (severity) => {
  return VALID_SEVERITIES.includes(severity);
};

/**
 * Valide une chaîne non vide
 * @param {string} str
 * @param {number} minLength
 * @param {number} maxLength
 * @returns {boolean}
 */
const isValidString = (str, minLength = 1, maxLength = 255) => {
  if (!str || typeof str !== "string") return false;
  const trimmed = str.trim();
  return trimmed.length >= minLength && trimmed.length <= maxLength;
};

/**
 * Valide un nombre positif
 * @param {number} num
 * @returns {boolean}
 */
const isPositiveNumber = (num) => {
  return typeof num === "number" && !isNaN(num) && num >= 0;
};

/**
 * Valide les données d'une famille
 * @param {Object} family
 * @returns {{ isValid: boolean, errors: string[] }}
 */
const validateFamily = (family) => {
  const errors = [];
  
  if (!isValidString(family.address_line1, 5)) {
    errors.push("Adresse ligne 1 invalide (min. 5 caractères)");
  }
  if (!isValidPostalCode(family.postal_code)) {
    errors.push("Code postal invalide (format: 5 chiffres)");
  }
  if (!isValidString(family.city, 2)) {
    errors.push("Ville invalide (min. 2 caractères)");
  }
  if (!isValidPhone(family.phone_primary)) {
    errors.push("Téléphone principal invalide");
  }
  if (family.phone_secondary && !isValidPhone(family.phone_secondary)) {
    errors.push("Téléphone secondaire invalide");
  }
  if (!isValidEmail(family.email)) {
    errors.push("Email invalide");
  }
  
  return { isValid: errors.length === 0, errors };
};

/**
 * Valide les données d'un parent
 * @param {Object} parent
 * @returns {{ isValid: boolean, errors: string[] }}
 */
const validateParent = (parent) => {
  const errors = [];
  
  if (!isValidString(parent.first_name, 2)) {
    errors.push("Prénom invalide (min. 2 caractères)");
  }
  if (!isValidString(parent.last_name, 2)) {
    errors.push("Nom invalide (min. 2 caractères)");
  }
  if (!isValidEmail(parent.email)) {
    errors.push("Email parent invalide");
  }
  if (!isValidPhone(parent.phone)) {
    errors.push("Téléphone parent invalide");
  }
  if (!isValidRole(parent.role)) {
    errors.push(`Rôle invalide (valeurs acceptées: ${VALID_ROLES.join(", ")})`);
  }
  if (parent.salary_monthly !== undefined && parent.salary_monthly !== null) {
    if (!isPositiveNumber(parent.salary_monthly)) {
      errors.push("Salaire mensuel doit être un nombre positif");
    }
  }
  if (parent.social_coefficient !== undefined && parent.social_coefficient !== null) {
    if (!isPositiveNumber(parent.social_coefficient)) {
      errors.push("Coefficient social doit être un nombre positif");
    }
  }
  
  return { isValid: errors.length === 0, errors };
};

/**
 * Valide les données d'un enfant
 * @param {Object} child
 * @returns {{ isValid: boolean, errors: string[] }}
 */
const validateChild = (child) => {
  const errors = [];
  
  if (!isValidString(child.first_name, 2)) {
    errors.push("Prénom enfant invalide (min. 2 caractères)");
  }
  if (!isValidString(child.last_name, 2)) {
    errors.push("Nom enfant invalide (min. 2 caractères)");
  }
  if (!isValidBirthDate(child.birth_date)) {
    errors.push("Date de naissance invalide (format: YYYY-MM-DD)");
  }
  if (!isValidString(child.school_name, 2)) {
    errors.push("Nom de l'école invalide (min. 2 caractères)");
  }
  if (!isValidString(child.class_level, 1)) {
    errors.push("Niveau de classe invalide");
  }
  
  return { isValid: errors.length === 0, errors };
};

/**
 * Valide une allergie enfant
 * @param {Object} allergy
 * @returns {{ isValid: boolean, errors: string[] }}
 */
const validateChildAllergy = (allergy) => {
  const errors = [];
  
  if (!isValidString(allergy.allergy_id)) {
    errors.push("ID allergie requis");
  }
  if (!isValidSeverity(allergy.severity)) {
    errors.push(`Sévérité invalide (valeurs acceptées: ${VALID_SEVERITIES.join(", ")})`);
  }
  
  return { isValid: errors.length === 0, errors };
};

/**
 * Valide les jours de cantine
 * @param {Array} days
 * @returns {{ isValid: boolean, errors: string[] }}
 */
const validateCanteenDays = (days) => {
  const errors = [];
  
  if (!Array.isArray(days)) {
    errors.push("Les jours de cantine doivent être un tableau");
    return { isValid: false, errors };
  }
  
  days.forEach((day, index) => {
    if (!isValidDay(day)) {
      errors.push(`Jour invalide à l'index ${index}: ${day} (valeurs acceptées: ${VALID_DAYS.join(", ")})`);
    }
  });
  
  // Vérifie les doublons
  const uniqueDays = [...new Set(days)];
  if (uniqueDays.length !== days.length) {
    errors.push("Doublons détectés dans les jours de cantine");
  }
  
  return { isValid: errors.length === 0, errors };
};

/**
 * Valide une inscription complète
 * @param {Object} data - Données d'inscription
 * @returns {{ isValid: boolean, errors: Object }}
 */
const validateRegistration = (data) => {
  const errors = {
    family: [],
    parents: [],
    children: []
  };
  
  // Validation famille
  if (!data.family) {
    errors.family.push("Données famille requises");
  } else {
    const familyValidation = validateFamily(data.family);
    errors.family = familyValidation.errors;
  }
  
  // Validation parents (au moins 1 requis)
  if (!data.parents || !Array.isArray(data.parents) || data.parents.length === 0) {
    errors.parents.push("Au moins un parent/responsable requis");
  } else {
    data.parents.forEach((parent, index) => {
      const parentValidation = validateParent(parent);
      if (!parentValidation.isValid) {
        errors.parents.push(`Parent ${index + 1}: ${parentValidation.errors.join(", ")}`);
      }
    });
  }
  
  // Validation enfants (au moins 1 requis)
  if (!data.children || !Array.isArray(data.children) || data.children.length === 0) {
    errors.children.push("Au moins un enfant requis");
  } else {
    data.children.forEach((child, index) => {
      const childValidation = validateChild(child.info || child);
      if (!childValidation.isValid) {
        errors.children.push(`Enfant ${index + 1}: ${childValidation.errors.join(", ")}`);
      }
      
      // Validation allergies (optionnel)
      if (child.allergies && Array.isArray(child.allergies)) {
        child.allergies.forEach((allergy, allergyIndex) => {
          const allergyValidation = validateChildAllergy(allergy);
          if (!allergyValidation.isValid) {
            errors.children.push(`Enfant ${index + 1}, Allergie ${allergyIndex + 1}: ${allergyValidation.errors.join(", ")}`);
          }
        });
      }
      
      // Validation jours cantine (optionnel)
      if (child.canteen_days) {
        const daysValidation = validateCanteenDays(child.canteen_days);
        if (!daysValidation.isValid) {
          errors.children.push(`Enfant ${index + 1}, Jours cantine: ${daysValidation.errors.join(", ")}`);
        }
      }
    });
  }
  
  const isValid = 
    errors.family.length === 0 && 
    errors.parents.length === 0 && 
    errors.children.length === 0;
  
  return { isValid, errors };
};

module.exports = {
  isValidEmail,
  isValidPhone,
  isValidPostalCode,
  isValidBirthDate,
  isValidRole,
  isValidDay,
  isValidSeverity,
  isValidString,
  isPositiveNumber,
  validateFamily,
  validateParent,
  validateChild,
  validateChildAllergy,
  validateCanteenDays,
  validateRegistration,
  VALID_ROLES,
  VALID_DAYS,
  VALID_SEVERITIES
};
