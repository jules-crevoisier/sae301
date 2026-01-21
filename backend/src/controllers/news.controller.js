/**
 * Contrôleur News - Gestion des actualités
 */

const NewsModel = require("../models/news.model");

/**
 * GET /api/news
 * Récupère toutes les actualités (avec options de filtrage)
 */
const getAllNews = (req, res) => {
  const options = {
    limit: req.query.limit ? parseInt(req.query.limit) : undefined,
    featured: req.query.featured === 'true' ? true : undefined,
    category: req.query.category || undefined
  };
  
  NewsModel.getAll(options, (err, news) => {
    if (err) {
      console.error("Erreur récupération actualités:", err);
      return res.status(500).json({ 
        success: false,
        message: "Erreur serveur" 
      });
    }
    
    res.status(200).json({
      success: true,
      count: news.length,
      data: news
    });
  });
};

/**
 * GET /api/news/:id
 * Récupère une actualité par ID
 */
const getNewsById = (req, res) => {
  const { id } = req.params;
  
  NewsModel.getById(id, (err, news) => {
    if (err) {
      console.error("Erreur récupération actualité:", err);
      return res.status(500).json({ 
        success: false,
        message: "Erreur serveur" 
      });
    }
    
    if (!news) {
      return res.status(404).json({ 
        success: false,
        message: "Actualité non trouvée" 
      });
    }
    
    res.status(200).json({
      success: true,
      data: news
    });
  });
};

/**
 * GET /api/news/category/:category
 * Récupère les actualités par catégorie
 */
const getNewsByCategory = (req, res) => {
  const { category } = req.params;
  
  NewsModel.getByCategory(category, (err, news) => {
    if (err) {
      console.error("Erreur récupération actualités:", err);
      return res.status(500).json({ 
        success: false,
        message: "Erreur serveur" 
      });
    }
    
    res.status(200).json({
      success: true,
      count: news.length,
      data: news
    });
  });
};

/**
 * POST /api/news
 * Crée une nouvelle actualité
 */
const createNews = (req, res) => {
  const newsData = req.body;
  
  // Validation basique
  if (!newsData.title || !newsData.category || !newsData.date) {
    return res.status(400).json({
      success: false,
      message: "Données invalides: title, category et date sont requis"
    });
  }
  
  NewsModel.create(newsData, (err, result) => {
    if (err) {
      console.error("Erreur création actualité:", err);
      return res.status(500).json({ 
        success: false,
        message: "Erreur lors de la création" 
      });
    }
    
    // Récupère l'actualité créée
    NewsModel.getById(result.id, (err, news) => {
      if (err) {
        console.error("Erreur récupération actualité créée:", err);
        return res.status(500).json({ 
          success: false,
          message: "Actualité créée mais erreur lors de la récupération" 
        });
      }
      
      res.status(201).json({
        success: true,
        message: "Actualité créée avec succès",
        data: news
      });
    });
  });
};

/**
 * PUT /api/news/:id
 * Met à jour une actualité
 */
const updateNews = (req, res) => {
  const { id } = req.params;
  const newsData = req.body;
  
  // Vérifie que l'actualité existe
  NewsModel.getById(id, (err, news) => {
    if (err) {
      console.error("Erreur récupération actualité:", err);
      return res.status(500).json({ 
        success: false,
        message: "Erreur serveur" 
      });
    }
    
    if (!news) {
      return res.status(404).json({ 
        success: false,
        message: "Actualité non trouvée" 
      });
    }
    
    NewsModel.update(id, newsData, (err) => {
      if (err) {
        console.error("Erreur mise à jour actualité:", err);
        return res.status(500).json({ 
          success: false,
          message: "Erreur lors de la mise à jour" 
        });
      }
      
      // Récupère l'actualité mise à jour
      NewsModel.getById(id, (err, updatedNews) => {
        if (err) {
          console.error("Erreur récupération actualité mise à jour:", err);
          return res.status(500).json({ 
            success: false,
            message: "Actualité mise à jour mais erreur lors de la récupération" 
          });
        }
        
        res.status(200).json({
          success: true,
          message: "Actualité mise à jour avec succès",
          data: updatedNews
        });
      });
    });
  });
};

/**
 * DELETE /api/news/:id
 * Supprime une actualité
 */
const deleteNews = (req, res) => {
  const { id } = req.params;
  
  NewsModel.getById(id, (err, news) => {
    if (err) {
      console.error("Erreur récupération actualité:", err);
      return res.status(500).json({ 
        success: false,
        message: "Erreur serveur" 
      });
    }
    
    if (!news) {
      return res.status(404).json({ 
        success: false,
        message: "Actualité non trouvée" 
      });
    }
    
    NewsModel.remove(id, (err) => {
      if (err) {
        console.error("Erreur suppression actualité:", err);
        return res.status(500).json({ 
          success: false,
          message: "Erreur lors de la suppression" 
        });
      }
      
      res.status(200).json({
        success: true,
        message: "Actualité supprimée avec succès"
      });
    });
  });
};

module.exports = {
  getAllNews,
  getNewsById,
  getNewsByCategory,
  createNews,
  updateNews,
  deleteNews
};
