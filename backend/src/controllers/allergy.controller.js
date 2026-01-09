/**
 * Contrôleur Allergy - Gestion des allergies (référentiel)
 */

const AllergyModel = require("../models/allergy.model");

/**
 * GET /api/allergies
 * Récupère toutes les allergies disponibles
 */
const getAllAllergies = (req, res) => {
  AllergyModel.getAll((err, allergies) => {
    if (err) {
      console.error("Erreur récupération allergies:", err);
      return res.status(500).json({ message: "Erreur serveur" });
    }
    
    res.status(200).json({
      success: true,
      count: allergies.length,
      data: allergies
    });
  });
};

/**
 * POST /api/allergies
 * Crée une nouvelle allergie dans le référentiel
 */
const createAllergy = (req, res) => {
  const { label } = req.body;
  
  if (!label || typeof label !== "string" || label.trim().length < 2) {
    return res.status(400).json({
      message: "Label d'allergie invalide (min. 2 caractères)"
    });
  }
  
  AllergyModel.create(label.trim(), (err, id) => {
    if (err) {
      if (err.message.includes("UNIQUE constraint")) {
        return res.status(409).json({ message: "Cette allergie existe déjà" });
      }
      console.error("Erreur création allergie:", err);
      return res.status(500).json({ message: "Erreur création" });
    }
    
    res.status(201).json({
      success: true,
      message: "Allergie créée avec succès",
      data: { id, label: label.trim() }
    });
  });
};

/**
 * GET /api/children/:childId/allergies
 * Récupère les allergies d'un enfant
 */
const getChildAllergies = (req, res) => {
  const { childId } = req.params;
  
  AllergyModel.getByChildId(childId, (err, allergies) => {
    if (err) {
      console.error("Erreur récupération allergies enfant:", err);
      return res.status(500).json({ message: "Erreur serveur" });
    }
    
    res.status(200).json({
      success: true,
      count: allergies.length,
      data: allergies
    });
  });
};

/**
 * POST /api/children/:childId/allergies
 * Ajoute une allergie à un enfant
 */
const addAllergyToChild = (req, res) => {
  const { childId } = req.params;
  const { allergy_id, severity, comment } = req.body;
  
  const validSeverities = ["LEGERE", "MOYENNE", "SEVERE"];
  
  if (!allergy_id) {
    return res.status(400).json({ message: "ID allergie requis" });
  }
  
  if (!severity || !validSeverities.includes(severity)) {
    return res.status(400).json({
      message: `Sévérité invalide. Valeurs acceptées: ${validSeverities.join(", ")}`
    });
  }
  
  AllergyModel.addToChild({
    child_id: childId,
    allergy_id,
    severity,
    comment
  }, (err, id) => {
    if (err) {
      if (err.message.includes("UNIQUE constraint")) {
        return res.status(409).json({ message: "Cette allergie est déjà associée à cet enfant" });
      }
      if (err.message.includes("FOREIGN KEY")) {
        return res.status(404).json({ message: "Enfant ou allergie non trouvé" });
      }
      console.error("Erreur ajout allergie:", err);
      return res.status(500).json({ message: "Erreur ajout allergie" });
    }
    
    res.status(201).json({
      success: true,
      message: "Allergie ajoutée à l'enfant",
      data: { id }
    });
  });
};

/**
 * PUT /api/children/:childId/allergies/:allergyId
 * Met à jour l'allergie d'un enfant
 */
const updateChildAllergy = (req, res) => {
  const { allergyId } = req.params;
  const { severity, comment } = req.body;
  
  const validSeverities = ["LEGERE", "MOYENNE", "SEVERE"];
  
  if (severity && !validSeverities.includes(severity)) {
    return res.status(400).json({
      message: `Sévérité invalide. Valeurs acceptées: ${validSeverities.join(", ")}`
    });
  }
  
  AllergyModel.updateChildAllergy(allergyId, { severity, comment }, (err) => {
    if (err) {
      console.error("Erreur mise à jour allergie:", err);
      return res.status(500).json({ message: "Erreur mise à jour" });
    }
    
    res.status(200).json({
      success: true,
      message: "Allergie mise à jour"
    });
  });
};

/**
 * DELETE /api/children/:childId/allergies/:allergyId
 * Supprime une allergie d'un enfant
 */
const removeAllergyFromChild = (req, res) => {
  const { allergyId } = req.params;
  
  AllergyModel.removeFromChild(allergyId, (err) => {
    if (err) {
      console.error("Erreur suppression allergie:", err);
      return res.status(500).json({ message: "Erreur suppression" });
    }
    
    res.status(200).json({
      success: true,
      message: "Allergie supprimée de l'enfant"
    });
  });
};

module.exports = {
  getAllAllergies,
  createAllergy,
  getChildAllergies,
  addAllergyToChild,
  updateChildAllergy,
  removeAllergyFromChild
};
