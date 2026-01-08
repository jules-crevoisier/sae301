/**
 * Routes Allergy - Gestion des allergies
 */

const express = require("express");
const router = express.Router();

const allergyController = require("../controllers/allergy.controller");

// GET /api/allergies - Liste toutes les allergies disponibles
router.get("/", allergyController.getAllAllergies);

// POST /api/allergies - Crée une nouvelle allergie
router.post("/", allergyController.createAllergy);

module.exports = router;
