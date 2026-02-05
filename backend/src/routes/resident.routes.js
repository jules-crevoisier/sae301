/**
 * Routes Resident - Espace habitant (accès par email)
 */

const express = require("express");
const router = express.Router();
const residentController = require("../controllers/resident.controller");

// GET /api/resident?email=xxx - Récupère le dossier habitant par email de contact
router.get("/", residentController.getResidentByEmail);

module.exports = router;
