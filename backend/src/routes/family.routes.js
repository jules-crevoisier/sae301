/**
 * Routes Family - Gestion des familles
 */

const express = require("express");
const router = express.Router();

const familyController = require("../controllers/family.controller");

// GET /api/families - Liste toutes les familles
router.get("/", familyController.getAllFamilies);

// GET /api/families/reference/:ref - Récupère par numéro de référence
router.get("/reference/:ref", familyController.getFamilyByReference);

// GET /api/families/:id - Récupère une famille par ID
router.get("/:id", familyController.getFamilyById);

// GET /api/families/:id/full - Récupère une famille complète
router.get("/:id/full", familyController.getFullFamily);

// POST /api/families - Crée une nouvelle famille
router.post("/", familyController.createFamily);

// PUT /api/families/:id - Met à jour une famille
router.put("/:id", familyController.updateFamily);

// DELETE /api/families/:id - Supprime une famille
router.delete("/:id", familyController.deleteFamily);

module.exports = router;
