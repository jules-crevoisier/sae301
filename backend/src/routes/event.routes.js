/**
 * Routes Event - Gestion des événements
 */

const express = require("express");
const router = express.Router();

const eventController = require("../controllers/event.controller");

// GET /api/events - Liste tous les événements (avec query params: start_date, end_date, category)
router.get("/", eventController.getAllEvents);

// GET /api/events/category/:category - Récupère les événements par catégorie
router.get("/category/:category", eventController.getEventsByCategory);

// GET /api/events/range/:startDate/:endDate - Récupère les événements pour une période
router.get("/range/:startDate/:endDate", eventController.getEventsByDateRange);

// GET /api/events/:id - Récupère un événement par ID
router.get("/:id", eventController.getEventById);

// POST /api/events - Crée un nouvel événement
router.post("/", eventController.createEvent);

// PUT /api/events/:id - Met à jour un événement
router.put("/:id", eventController.updateEvent);

// DELETE /api/events/:id - Supprime un événement
router.delete("/:id", eventController.deleteEvent);

module.exports = router;
