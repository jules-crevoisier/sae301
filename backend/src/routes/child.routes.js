/**
 * Routes Child - Gestion des enfants et leurs données
 */

const express = require("express");
const router = express.Router();

const allergyController = require("../controllers/allergy.controller");
const ChildModel = require("../models/child.model");
const CanteenScheduleModel = require("../models/canteen-schedule.model");

// GET /api/children/:childId - Récupère un enfant par ID
router.get("/:childId", (req, res) => {
  const { childId } = req.params;
  
  ChildModel.getFullChild(childId, (err, child) => {
    if (err) {
      console.error("Erreur récupération enfant:", err);
      return res.status(500).json({ message: "Erreur serveur" });
    }
    
    if (!child) {
      return res.status(404).json({ message: "Enfant non trouvé" });
    }
    
    res.status(200).json({
      success: true,
      data: child
    });
  });
});

// GET /api/children/:childId/allergies - Récupère les allergies d'un enfant
router.get("/:childId/allergies", allergyController.getChildAllergies);

// POST /api/children/:childId/allergies - Ajoute une allergie à un enfant
router.post("/:childId/allergies", allergyController.addAllergyToChild);

// PUT /api/children/:childId/allergies/:allergyId - Met à jour une allergie
router.put("/:childId/allergies/:allergyId", allergyController.updateChildAllergy);

// DELETE /api/children/:childId/allergies/:allergyId - Supprime une allergie
router.delete("/:childId/allergies/:allergyId", allergyController.removeAllergyFromChild);

// GET /api/children/:childId/schedule - Récupère le planning cantine
router.get("/:childId/schedule", (req, res) => {
  const { childId } = req.params;
  
  CanteenScheduleModel.getByChildId(childId, (err, schedule) => {
    if (err) {
      console.error("Erreur récupération planning:", err);
      return res.status(500).json({ message: "Erreur serveur" });
    }
    
    res.status(200).json({
      success: true,
      data: schedule
    });
  });
});

// PUT /api/children/:childId/schedule - Met à jour le planning cantine
router.put("/:childId/schedule", (req, res) => {
  const { childId } = req.params;
  const { days } = req.body;
  
  const validDays = ["LUNDI", "MARDI", "MERCREDI", "JEUDI", "VENDREDI"];
  
  if (!days || !Array.isArray(days)) {
    return res.status(400).json({ message: "Liste de jours requise" });
  }
  
  // Valide les jours
  const invalidDays = days.filter(d => !validDays.includes(d));
  if (invalidDays.length > 0) {
    return res.status(400).json({
      message: `Jours invalides: ${invalidDays.join(", ")}. Valeurs acceptées: ${validDays.join(", ")}`
    });
  }
  
  CanteenScheduleModel.updateChildSchedule(days, childId, (err) => {
    if (err) {
      console.error("Erreur mise à jour planning:", err);
      return res.status(500).json({ message: "Erreur mise à jour" });
    }
    
    res.status(200).json({
      success: true,
      message: "Planning mis à jour avec succès"
    });
  });
});

module.exports = router;
