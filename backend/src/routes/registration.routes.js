/**
 * Routes Registration - Gestion des inscriptions complètes
 */

const express = require("express");
const router = express.Router();

const registrationController = require("../controllers/registration.controller");

// POST /api/inscription - Crée une inscription complète
router.post("/", registrationController.createFullRegistration);

// GET /api/inscriptions - Liste toutes les inscriptions
router.get("/", registrationController.getAllRegistrations);

// GET /api/inscriptions/:id - Récupère une inscription par ID
router.get("/:id", registrationController.getRegistrationById);

// GET /api/inscriptions/family/:familyId - Récupère l'inscription d'une famille
router.get("/family/:familyId", registrationController.getRegistrationByFamilyId);

// PUT /api/inscriptions/:id/status - Met à jour le statut
router.put("/:id/status", registrationController.updateRegistrationStatus);

// DELETE /api/inscriptions/:id - Supprime une inscription
router.delete("/:id", registrationController.deleteRegistration);

module.exports = router;
