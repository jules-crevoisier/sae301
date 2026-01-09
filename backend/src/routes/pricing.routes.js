/**
 * Routes Pricing - Gestion de la tarification
 */

const express = require("express");
const router = express.Router();

const pricingController = require("../controllers/pricing.controller");

// GET /api/pricing/tiers - Récupère les tranches tarifaires
router.get("/tiers", pricingController.getTiers);

// POST /api/pricing/calculate - Calcule la tarification (sans enregistrement)
router.post("/calculate", pricingController.calculatePricing);

// GET /api/pricing/family/:familyId - Récupère la tarification d'une famille
router.get("/family/:familyId", pricingController.getFamilyPricing);

// POST /api/pricing/family/:familyId/recalculate - Recalcule la tarification
router.post("/family/:familyId/recalculate", pricingController.recalculateFamilyPricing);

// GET /api/pricing/family/:familyId/history - Historique des tarifications
router.get("/family/:familyId/history", pricingController.getFamilyPricingHistory);

module.exports = router;
