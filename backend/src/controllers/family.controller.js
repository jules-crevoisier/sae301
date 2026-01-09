/**
 * Contrôleur Family - Gestion des familles
 */

const FamilyModel = require("../models/family.model");
const ParentModel = require("../models/parent.model");
const ChildModel = require("../models/child.model");
const AllergyModel = require("../models/allergy.model");
const CanteenScheduleModel = require("../models/canteen-schedule.model");
const { validateFamily } = require("../utils/validators");

/**
 * GET /api/families
 * Récupère toutes les familles
 */
const getAllFamilies = (req, res) => {
  FamilyModel.getAll((err, families) => {
    if (err) {
      console.error("Erreur récupération familles:", err);
      return res.status(500).json({ message: "Erreur serveur" });
    }
    
    res.status(200).json({
      success: true,
      count: families.length,
      data: families
    });
  });
};

/**
 * GET /api/families/:id
 * Récupère une famille par ID
 */
const getFamilyById = (req, res) => {
  const { id } = req.params;
  
  FamilyModel.getById(id, (err, family) => {
    if (err) {
      console.error("Erreur récupération famille:", err);
      return res.status(500).json({ message: "Erreur serveur" });
    }
    
    if (!family) {
      return res.status(404).json({ message: "Famille non trouvée" });
    }
    
    res.status(200).json({
      success: true,
      data: family
    });
  });
};

/**
 * GET /api/families/:id/full
 * Récupère une famille complète avec parents, enfants, allergies et planning
 */
const getFullFamily = (req, res) => {
  const { id } = req.params;
  
  FamilyModel.getById(id, (err, family) => {
    if (err) {
      console.error("Erreur récupération famille:", err);
      return res.status(500).json({ message: "Erreur serveur" });
    }
    
    if (!family) {
      return res.status(404).json({ message: "Famille non trouvée" });
    }
    
    // Récupère les parents
    ParentModel.getByFamilyId(id, (err, parents) => {
      if (err) {
        console.error("Erreur récupération parents:", err);
        return res.status(500).json({ message: "Erreur serveur" });
      }
      
      // Récupère les enfants
      ChildModel.getByFamilyId(id, (err, children) => {
        if (err) {
          console.error("Erreur récupération enfants:", err);
          return res.status(500).json({ message: "Erreur serveur" });
        }
        
        // Pour chaque enfant, récupère les allergies et le planning
        let processedChildren = 0;
        const childrenWithDetails = [];
        
        if (children.length === 0) {
          return res.status(200).json({
            success: true,
            data: { ...family, parents, children: [] }
          });
        }
        
        children.forEach(child => {
          AllergyModel.getByChildId(child.id, (err, allergies) => {
            if (err) {
              console.error("Erreur récupération allergies:", err);
            }
            
            CanteenScheduleModel.getDaysByChildId(child.id, (err, canteenDays) => {
              if (err) {
                console.error("Erreur récupération planning:", err);
              }
              
              childrenWithDetails.push({
                ...child,
                allergies: allergies || [],
                canteen_days: canteenDays || []
              });
              
              processedChildren++;
              
              if (processedChildren === children.length) {
                // Trie les enfants par date de naissance
                childrenWithDetails.sort((a, b) => 
                  new Date(a.birth_date) - new Date(b.birth_date)
                );
                
                res.status(200).json({
                  success: true,
                  data: {
                    ...family,
                    parents,
                    children: childrenWithDetails
                  }
                });
              }
            });
          });
        });
      });
    });
  });
};

/**
 * GET /api/families/reference/:ref
 * Récupère une famille par numéro de référence
 */
const getFamilyByReference = (req, res) => {
  const { ref } = req.params;
  
  FamilyModel.getByReference(ref, (err, family) => {
    if (err) {
      console.error("Erreur récupération famille:", err);
      return res.status(500).json({ message: "Erreur serveur" });
    }
    
    if (!family) {
      return res.status(404).json({ message: "Famille non trouvée" });
    }
    
    res.status(200).json({
      success: true,
      data: family
    });
  });
};

/**
 * POST /api/families
 * Crée une nouvelle famille
 */
const createFamily = (req, res) => {
  const familyData = req.body;
  
  // Validation
  const validation = validateFamily(familyData);
  if (!validation.isValid) {
    return res.status(400).json({
      message: "Données invalides",
      errors: validation.errors
    });
  }
  
  // Vérifie si l'email existe déjà
  FamilyModel.getByEmail(familyData.email, (err, existingFamily) => {
    if (err) {
      console.error("Erreur vérification email:", err);
      return res.status(500).json({ message: "Erreur serveur" });
    }
    
    if (existingFamily) {
      return res.status(409).json({
        message: "Une famille avec cet email existe déjà",
        reference_number: existingFamily.reference_number
      });
    }
    
    FamilyModel.create(familyData, (err, result) => {
      if (err) {
        console.error("Erreur création famille:", err);
        return res.status(500).json({ message: "Erreur lors de la création" });
      }
      
      res.status(201).json({
        success: true,
        message: "Famille créée avec succès",
        data: {
          id: result.id,
          reference_number: result.reference_number
        }
      });
    });
  });
};

/**
 * PUT /api/families/:id
 * Met à jour une famille
 */
const updateFamily = (req, res) => {
  const { id } = req.params;
  const familyData = req.body;
  
  // Validation
  const validation = validateFamily(familyData);
  if (!validation.isValid) {
    return res.status(400).json({
      message: "Données invalides",
      errors: validation.errors
    });
  }
  
  // Vérifie que la famille existe
  FamilyModel.getById(id, (err, family) => {
    if (err) {
      console.error("Erreur récupération famille:", err);
      return res.status(500).json({ message: "Erreur serveur" });
    }
    
    if (!family) {
      return res.status(404).json({ message: "Famille non trouvée" });
    }
    
    FamilyModel.update(id, familyData, (err) => {
      if (err) {
        console.error("Erreur mise à jour famille:", err);
        return res.status(500).json({ message: "Erreur lors de la mise à jour" });
      }
      
      res.status(200).json({
        success: true,
        message: "Famille mise à jour avec succès"
      });
    });
  });
};

/**
 * DELETE /api/families/:id
 * Supprime une famille (et toutes les données associées)
 */
const deleteFamily = (req, res) => {
  const { id } = req.params;
  
  FamilyModel.getById(id, (err, family) => {
    if (err) {
      console.error("Erreur récupération famille:", err);
      return res.status(500).json({ message: "Erreur serveur" });
    }
    
    if (!family) {
      return res.status(404).json({ message: "Famille non trouvée" });
    }
    
    FamilyModel.remove(id, (err) => {
      if (err) {
        console.error("Erreur suppression famille:", err);
        return res.status(500).json({ message: "Erreur lors de la suppression" });
      }
      
      res.status(200).json({
        success: true,
        message: "Famille et données associées supprimées avec succès"
      });
    });
  });
};

module.exports = {
  getAllFamilies,
  getFamilyById,
  getFullFamily,
  getFamilyByReference,
  createFamily,
  updateFamily,
  deleteFamily
};
