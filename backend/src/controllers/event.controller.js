/**
 * Contrôleur Event - Gestion des événements
 */

const EventModel = require("../models/event.model");

/**
 * GET /api/events
 * Récupère tous les événements (avec options de filtrage)
 */
const getAllEvents = (req, res) => {
  const options = {
    start_date: req.query.start_date || undefined,
    end_date: req.query.end_date || undefined,
    category: req.query.category || undefined
  };
  
  EventModel.getAll(options, (err, events) => {
    if (err) {
      console.error("Erreur récupération événements:", err);
      return res.status(500).json({ 
        success: false,
        message: "Erreur serveur" 
      });
    }
    
    res.status(200).json({
      success: true,
      count: events.length,
      data: events
    });
  });
};

/**
 * GET /api/events/:id
 * Récupère un événement par ID
 */
const getEventById = (req, res) => {
  const { id } = req.params;
  
  EventModel.getById(id, (err, event) => {
    if (err) {
      console.error("Erreur récupération événement:", err);
      return res.status(500).json({ 
        success: false,
        message: "Erreur serveur" 
      });
    }
    
    if (!event) {
      return res.status(404).json({ 
        success: false,
        message: "Événement non trouvé" 
      });
    }
    
    res.status(200).json({
      success: true,
      data: event
    });
  });
};

/**
 * GET /api/events/category/:category
 * Récupère les événements par catégorie
 */
const getEventsByCategory = (req, res) => {
  const { category } = req.params;
  
  EventModel.getByCategory(category, (err, events) => {
    if (err) {
      console.error("Erreur récupération événements:", err);
      return res.status(500).json({ 
        success: false,
        message: "Erreur serveur" 
      });
    }
    
    res.status(200).json({
      success: true,
      count: events.length,
      data: events
    });
  });
};

/**
 * GET /api/events/range/:startDate/:endDate
 * Récupère les événements pour une période donnée
 */
const getEventsByDateRange = (req, res) => {
  const { startDate, endDate } = req.params;
  
  EventModel.getByDateRange(startDate, endDate, (err, events) => {
    if (err) {
      console.error("Erreur récupération événements:", err);
      return res.status(500).json({ 
        success: false,
        message: "Erreur serveur" 
      });
    }
    
    res.status(200).json({
      success: true,
      count: events.length,
      data: events
    });
  });
};

/**
 * POST /api/events
 * Crée un nouvel événement
 */
const createEvent = (req, res) => {
  const eventData = req.body;
  
  // Validation basique
  if (!eventData.title || !eventData.start_date) {
    return res.status(400).json({
      success: false,
      message: "Données invalides: title et start_date sont requis"
    });
  }
  
  EventModel.create(eventData, (err, result) => {
    if (err) {
      console.error("Erreur création événement:", err);
      return res.status(500).json({ 
        success: false,
        message: "Erreur lors de la création" 
      });
    }
    
    // Récupère l'événement créé
    EventModel.getById(result.id, (err, event) => {
      if (err) {
        console.error("Erreur récupération événement créé:", err);
        return res.status(500).json({ 
          success: false,
          message: "Événement créé mais erreur lors de la récupération" 
        });
      }
      
      res.status(201).json({
        success: true,
        message: "Événement créé avec succès",
        data: event
      });
    });
  });
};

/**
 * PUT /api/events/:id
 * Met à jour un événement
 */
const updateEvent = (req, res) => {
  const { id } = req.params;
  const eventData = req.body;
  
  // Vérifie que l'événement existe
  EventModel.getById(id, (err, event) => {
    if (err) {
      console.error("Erreur récupération événement:", err);
      return res.status(500).json({ 
        success: false,
        message: "Erreur serveur" 
      });
    }
    
    if (!event) {
      return res.status(404).json({ 
        success: false,
        message: "Événement non trouvé" 
      });
    }
    
    EventModel.update(id, eventData, (err) => {
      if (err) {
        console.error("Erreur mise à jour événement:", err);
        return res.status(500).json({ 
          success: false,
          message: "Erreur lors de la mise à jour" 
        });
      }
      
      // Récupère l'événement mis à jour
      EventModel.getById(id, (err, updatedEvent) => {
        if (err) {
          console.error("Erreur récupération événement mis à jour:", err);
          return res.status(500).json({ 
            success: false,
            message: "Événement mis à jour mais erreur lors de la récupération" 
          });
        }
        
        res.status(200).json({
          success: true,
          message: "Événement mis à jour avec succès",
          data: updatedEvent
        });
      });
    });
  });
};

/**
 * DELETE /api/events/:id
 * Supprime un événement
 */
const deleteEvent = (req, res) => {
  const { id } = req.params;
  
  EventModel.getById(id, (err, event) => {
    if (err) {
      console.error("Erreur récupération événement:", err);
      return res.status(500).json({ 
        success: false,
        message: "Erreur serveur" 
      });
    }
    
    if (!event) {
      return res.status(404).json({ 
        success: false,
        message: "Événement non trouvé" 
      });
    }
    
    EventModel.remove(id, (err) => {
      if (err) {
        console.error("Erreur suppression événement:", err);
        return res.status(500).json({ 
          success: false,
          message: "Erreur lors de la suppression" 
        });
      }
      
      res.status(200).json({
        success: true,
        message: "Événement supprimé avec succès"
      });
    });
  });
};

module.exports = {
  getAllEvents,
  getEventById,
  getEventsByCategory,
  getEventsByDateRange,
  createEvent,
  updateEvent,
  deleteEvent
};
