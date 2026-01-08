/**
 * Contrôleur Registration - Gestion des inscriptions complètes
 */

const FamilyModel = require("../models/family.model");
const ParentModel = require("../models/parent.model");
const ChildModel = require("../models/child.model");
const AllergyModel = require("../models/allergy.model");
const CanteenScheduleModel = require("../models/canteen-schedule.model");
const PricingModel = require("../models/pricing.model");
const RegistrationModel = require("../models/registration.model");

const { validateRegistration } = require("../utils/validators");
const { calculateFamilyPricing } = require("../utils/pricing");

/**
 * POST /api/inscription
 * Crée une inscription complète (famille, parents, enfants, allergies, planning)
 */
const createFullRegistration = (req, res) => {
  const data = req.body;
  
  // Validation complète
  const validation = validateRegistration(data);
  if (!validation.isValid) {
    return res.status(400).json({
      success: false,
      message: "Données d'inscription invalides",
      errors: validation.errors
    });
  }
  
  // Vérifie si l'email existe déjà
  FamilyModel.getByEmail(data.family.email, (err, existingFamily) => {
    if (err) {
      console.error("Erreur vérification email:", err);
      return res.status(500).json({ message: "Erreur serveur" });
    }
    
    if (existingFamily) {
      return res.status(409).json({
        success: false,
        message: "Une inscription existe déjà pour cet email",
        reference_number: existingFamily.reference_number
      });
    }
    
    // === ÉTAPE 1: Création de la famille ===
    FamilyModel.create(data.family, (err, familyResult) => {
      if (err) {
        console.error("Erreur création famille:", err);
        return res.status(500).json({ message: "Erreur création famille" });
      }
      
      const familyId = familyResult.id;
      const referenceNumber = familyResult.reference_number;
      
      // === ÉTAPE 2: Création des parents ===
      ParentModel.createMany(data.parents, familyId, (err, parentIds) => {
        if (err) {
          console.error("Erreur création parents:", err);
          // Rollback: supprime la famille
          FamilyModel.remove(familyId, () => {});
          return res.status(500).json({ message: "Erreur création parents" });
        }
        
        // === ÉTAPE 3: Création des enfants avec allergies et planning ===
        processChildren(data.children, familyId, (err, childrenResults) => {
          if (err) {
            console.error("Erreur création enfants:", err);
            // Rollback
            FamilyModel.remove(familyId, () => {});
            return res.status(500).json({ message: "Erreur création enfants" });
          }
          
          // === ÉTAPE 4: Calcul de la tarification ===
          const pricingData = calculateFamilyPricing({
            parents: data.parents,
            children: data.children.map((child, index) => ({
              id: childrenResults[index].id,
              info: child.info || child,
              canteen_days: child.canteen_days || []
            }))
          });
          
          PricingModel.create({
            family_id: familyId,
            social_coefficient_used: pricingData.social_coefficient_used,
            price_per_meal: pricingData.price_per_meal,
            estimated_monthly_price: pricingData.estimated_monthly_price
          }, (err, pricingId) => {
            if (err) {
              console.error("Erreur création tarification:", err);
            }
            
            // === ÉTAPE 5: Création de la confirmation ===
            const summary = {
              family: {
                ...data.family,
                reference_number: referenceNumber
              },
              parents: data.parents.map((p, i) => ({
                ...p,
                id: parentIds[i]
              })),
              children: childrenResults,
              pricing: pricingData
            };
            
            RegistrationModel.create({
              family_id: familyId,
              summary_json: summary,
              status: "CONFIRMED"
            }, (err, confirmationId) => {
              if (err) {
                console.error("Erreur création confirmation:", err);
              }
              
              // Réponse finale
              res.status(201).json({
                success: true,
                message: "Inscription enregistrée avec succès",
                data: {
                  family_id: familyId,
                  reference_number: referenceNumber,
                  confirmation_id: confirmationId,
                  pricing: {
                    social_coefficient: pricingData.social_coefficient_used,
                    price_per_meal: pricingData.price_per_meal,
                    estimated_monthly_price: pricingData.estimated_monthly_price,
                    children_pricing: pricingData.children_pricing
                  }
                }
              });
            });
          });
        });
      });
    });
  });
};

/**
 * Traite la création des enfants avec leurs allergies et planning
 * @param {Array} children
 * @param {string} familyId
 * @param {Function} callback
 */
const processChildren = (children, familyId, callback) => {
  const results = [];
  let processedCount = 0;
  let hasError = false;
  
  if (children.length === 0) {
    return callback(null, []);
  }
  
  children.forEach((childData, index) => {
    const childInfo = childData.info || childData;
    
    // Crée l'enfant
    ChildModel.create({
      family_id: familyId,
      first_name: childInfo.first_name,
      last_name: childInfo.last_name,
      birth_date: childInfo.birth_date,
      school_name: childInfo.school_name,
      class_level: childInfo.class_level
    }, (err, childId) => {
      if (err || hasError) {
        hasError = true;
        if (!err) return;
        return callback(err);
      }
      
      const childResult = {
        id: childId,
        ...childInfo,
        allergies: [],
        canteen_days: childData.canteen_days || []
      };
      
      // Traite les allergies
      if (childData.allergies && childData.allergies.length > 0) {
        AllergyModel.addManyToChild(childData.allergies, childId, (err, allergyIds) => {
          if (err) {
            console.error("Erreur ajout allergies:", err);
          } else {
            childResult.allergies = childData.allergies.map((a, i) => ({
              ...a,
              id: allergyIds[i]
            }));
          }
          
          // Traite le planning
          processSchedule(childData.canteen_days, childId, childResult, results, index, () => {
            processedCount++;
            if (processedCount === children.length) {
              callback(null, results);
            }
          });
        });
      } else {
        // Pas d'allergies, traite directement le planning
        processSchedule(childData.canteen_days, childId, childResult, results, index, () => {
          processedCount++;
          if (processedCount === children.length) {
            callback(null, results);
          }
        });
      }
    });
  });
};

/**
 * Traite la création du planning cantine
 */
const processSchedule = (canteenDays, childId, childResult, results, index, done) => {
  if (canteenDays && canteenDays.length > 0) {
    CanteenScheduleModel.createFromDays(canteenDays, childId, (err) => {
      if (err) {
        console.error("Erreur ajout planning:", err);
      }
      results[index] = childResult;
      done();
    });
  } else {
    results[index] = childResult;
    done();
  }
};

/**
 * GET /api/inscriptions
 * Récupère toutes les inscriptions confirmées
 */
const getAllRegistrations = (req, res) => {
  const { status, limit, offset } = req.query;
  
  RegistrationModel.getAll({ 
    status, 
    limit: limit ? parseInt(limit) : undefined,
    offset: offset ? parseInt(offset) : undefined
  }, (err, registrations) => {
    if (err) {
      console.error("Erreur récupération inscriptions:", err);
      return res.status(500).json({ message: "Erreur serveur" });
    }
    
    res.status(200).json({
      success: true,
      count: registrations.length,
      data: registrations
    });
  });
};

/**
 * GET /api/inscriptions/:id
 * Récupère une inscription par ID
 */
const getRegistrationById = (req, res) => {
  const { id } = req.params;
  
  RegistrationModel.getById(id, (err, registration) => {
    if (err) {
      console.error("Erreur récupération inscription:", err);
      return res.status(500).json({ message: "Erreur serveur" });
    }
    
    if (!registration) {
      return res.status(404).json({ message: "Inscription non trouvée" });
    }
    
    res.status(200).json({
      success: true,
      data: registration
    });
  });
};

/**
 * GET /api/inscriptions/family/:familyId
 * Récupère l'inscription d'une famille
 */
const getRegistrationByFamilyId = (req, res) => {
  const { familyId } = req.params;
  
  RegistrationModel.getByFamilyId(familyId, (err, registration) => {
    if (err) {
      console.error("Erreur récupération inscription:", err);
      return res.status(500).json({ message: "Erreur serveur" });
    }
    
    if (!registration) {
      return res.status(404).json({ message: "Inscription non trouvée pour cette famille" });
    }
    
    res.status(200).json({
      success: true,
      data: registration
    });
  });
};

/**
 * PUT /api/inscriptions/:id/status
 * Met à jour le statut d'une inscription
 */
const updateRegistrationStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  const validStatuses = ["PENDING", "CONFIRMED", "CANCELLED"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      message: `Statut invalide. Valeurs acceptées: ${validStatuses.join(", ")}`
    });
  }
  
  RegistrationModel.getById(id, (err, registration) => {
    if (err) {
      console.error("Erreur récupération inscription:", err);
      return res.status(500).json({ message: "Erreur serveur" });
    }
    
    if (!registration) {
      return res.status(404).json({ message: "Inscription non trouvée" });
    }
    
    RegistrationModel.updateStatus(id, status, (err) => {
      if (err) {
        console.error("Erreur mise à jour statut:", err);
        return res.status(500).json({ message: "Erreur mise à jour" });
      }
      
      res.status(200).json({
        success: true,
        message: "Statut mis à jour avec succès"
      });
    });
  });
};

/**
 * DELETE /api/inscriptions/:id
 * Annule/Supprime une inscription
 */
const deleteRegistration = (req, res) => {
  const { id } = req.params;
  
  RegistrationModel.getById(id, (err, registration) => {
    if (err) {
      console.error("Erreur récupération inscription:", err);
      return res.status(500).json({ message: "Erreur serveur" });
    }
    
    if (!registration) {
      return res.status(404).json({ message: "Inscription non trouvée" });
    }
    
    // Supprime la famille (cascade supprime tout)
    FamilyModel.remove(registration.family_id, (err) => {
      if (err) {
        console.error("Erreur suppression:", err);
        return res.status(500).json({ message: "Erreur suppression" });
      }
      
      res.status(200).json({
        success: true,
        message: "Inscription et données associées supprimées avec succès"
      });
    });
  });
};

module.exports = {
  createFullRegistration,
  getAllRegistrations,
  getRegistrationById,
  getRegistrationByFamilyId,
  updateRegistrationStatus,
  deleteRegistration
};
