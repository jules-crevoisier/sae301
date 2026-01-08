/**
 * Contrôleur Pricing - Gestion de la tarification
 */

const PricingModel = require("../models/pricing.model");
const FamilyModel = require("../models/family.model");
const ParentModel = require("../models/parent.model");
const ChildModel = require("../models/child.model");
const CanteenScheduleModel = require("../models/canteen-schedule.model");

const { calculateFamilyPricing, getPricingTiers } = require("../utils/pricing");

/**
 * GET /api/pricing/tiers
 * Récupère les tranches tarifaires
 */
const getTiers = (req, res) => {
  const tiers = getPricingTiers();
  
  res.status(200).json({
    success: true,
    data: tiers
  });
};

/**
 * POST /api/pricing/calculate
 * Calcule la tarification pour des données fournies (sans enregistrement)
 */
const calculatePricing = (req, res) => {
  const { parents, children } = req.body;
  
  if (!parents || !Array.isArray(parents) || parents.length === 0) {
    return res.status(400).json({ message: "Au moins un parent requis" });
  }
  
  if (!children || !Array.isArray(children)) {
    return res.status(400).json({ message: "Liste d'enfants requise" });
  }
  
  const pricing = calculateFamilyPricing({ parents, children });
  
  res.status(200).json({
    success: true,
    data: pricing
  });
};

/**
 * GET /api/pricing/family/:familyId
 * Récupère la tarification d'une famille existante
 */
const getFamilyPricing = (req, res) => {
  const { familyId } = req.params;
  
  PricingModel.getLatestByFamilyId(familyId, (err, pricing) => {
    if (err) {
      console.error("Erreur récupération tarification:", err);
      return res.status(500).json({ message: "Erreur serveur" });
    }
    
    if (!pricing) {
      return res.status(404).json({ message: "Aucune tarification trouvée pour cette famille" });
    }
    
    res.status(200).json({
      success: true,
      data: pricing
    });
  });
};

/**
 * POST /api/pricing/family/:familyId/recalculate
 * Recalcule et enregistre la tarification d'une famille
 */
const recalculateFamilyPricing = (req, res) => {
  const { familyId } = req.params;
  
  // Vérifie que la famille existe
  FamilyModel.getById(familyId, (err, family) => {
    if (err) {
      console.error("Erreur récupération famille:", err);
      return res.status(500).json({ message: "Erreur serveur" });
    }
    
    if (!family) {
      return res.status(404).json({ message: "Famille non trouvée" });
    }
    
    // Récupère les parents
    ParentModel.getByFamilyId(familyId, (err, parents) => {
      if (err) {
        console.error("Erreur récupération parents:", err);
        return res.status(500).json({ message: "Erreur serveur" });
      }
      
      // Récupère les enfants
      ChildModel.getByFamilyId(familyId, (err, children) => {
        if (err) {
          console.error("Erreur récupération enfants:", err);
          return res.status(500).json({ message: "Erreur serveur" });
        }
        
        // Récupère le planning de chaque enfant
        let processedChildren = 0;
        const childrenWithSchedule = [];
        
        if (children.length === 0) {
          // Pas d'enfants, retourne un prix de 0
          return res.status(200).json({
            success: true,
            data: {
              social_coefficient_used: 1.5,
              price_per_meal: 2.50,
              estimated_monthly_price: 0,
              children_pricing: []
            }
          });
        }
        
        children.forEach(child => {
          CanteenScheduleModel.getDaysByChildId(child.id, (err, days) => {
            childrenWithSchedule.push({
              id: child.id,
              first_name: child.first_name,
              canteen_days: days || []
            });
            
            processedChildren++;
            
            if (processedChildren === children.length) {
              // Calcule la tarification
              const pricing = calculateFamilyPricing({
                parents,
                children: childrenWithSchedule
              });
              
              // Enregistre le résultat
              PricingModel.create({
                family_id: familyId,
                social_coefficient_used: pricing.social_coefficient_used,
                price_per_meal: pricing.price_per_meal,
                estimated_monthly_price: pricing.estimated_monthly_price
              }, (err, pricingId) => {
                if (err) {
                  console.error("Erreur enregistrement tarification:", err);
                  return res.status(500).json({ message: "Erreur enregistrement" });
                }
                
                res.status(200).json({
                  success: true,
                  message: "Tarification recalculée et enregistrée",
                  data: {
                    id: pricingId,
                    ...pricing
                  }
                });
              });
            }
          });
        });
      });
    });
  });
};

/**
 * GET /api/pricing/family/:familyId/history
 * Récupère l'historique des tarifications d'une famille
 */
const getFamilyPricingHistory = (req, res) => {
  const { familyId } = req.params;
  
  PricingModel.getByFamilyId(familyId, (err, history) => {
    if (err) {
      console.error("Erreur récupération historique:", err);
      return res.status(500).json({ message: "Erreur serveur" });
    }
    
    res.status(200).json({
      success: true,
      count: history.length,
      data: history
    });
  });
};

module.exports = {
  getTiers,
  calculatePricing,
  getFamilyPricing,
  recalculateFamilyPricing,
  getFamilyPricingHistory
};
