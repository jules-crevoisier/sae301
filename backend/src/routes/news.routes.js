/**
 * Routes News - Gestion des actualités
 */

const express = require("express");
const router = express.Router();

const newsController = require("../controllers/news.controller");

// GET /api/news - Liste toutes les actualités (avec query params: limit, featured, category)
router.get("/", newsController.getAllNews);

// GET /api/news/category/:category - Récupère les actualités par catégorie
router.get("/category/:category", newsController.getNewsByCategory);

// GET /api/news/:id - Récupère une actualité par ID
router.get("/:id", newsController.getNewsById);

// POST /api/news - Crée une nouvelle actualité
router.post("/", newsController.createNews);

// PUT /api/news/:id - Met à jour une actualité
router.put("/:id", newsController.updateNews);

// DELETE /api/news/:id - Supprime une actualité
router.delete("/:id", newsController.deleteNews);

module.exports = router;
