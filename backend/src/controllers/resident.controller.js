/**
 * Contrôleur Resident - Espace habitant (accès par email de contact / inscription)
 */

const FamilyModel = require("../models/family.model");
const ParentModel = require("../models/parent.model");
const ChildModel = require("../models/child.model");
const AllergyModel = require("../models/allergy.model");
const CanteenScheduleModel = require("../models/canteen-schedule.model");
const RegistrationModel = require("../models/registration.model");

/**
 * GET /api/resident?email=xxx
 * Récupère toutes les données de l'habitant (famille, parents, enfants, inscription cantine)
 * L'email correspond à celui du formulaire de contact / inscription cantine.
 */
const getResidentByEmail = (req, res) => {
  const email = (req.query.email || "").trim().toLowerCase();
  if (!email) {
    return res.status(400).json({
      success: false,
      message: "L'adresse email est requise",
    });
  }

  FamilyModel.getByEmail(email, (err, family) => {
    if (err) {
      console.error("Erreur récupération famille par email:", err);
      return res.status(500).json({
        success: false,
        message: "Erreur serveur",
      });
    }

    if (!family) {
      return res.status(404).json({
        success: false,
        message: "Aucun dossier trouvé pour cette adresse email. Utilisez l'email de contact de votre inscription ou de votre demande à la mairie.",
      });
    }

    const familyId = family.id;

    ParentModel.getByFamilyId(familyId, (err, parents) => {
      if (err) {
        console.error("Erreur récupération parents:", err);
        return res.status(500).json({
          success: false,
          message: "Erreur serveur",
        });
      }

      ChildModel.getByFamilyId(familyId, (err, children) => {
        if (err) {
          console.error("Erreur récupération enfants:", err);
          return res.status(500).json({
            success: false,
            message: "Erreur serveur",
          });
        }

        RegistrationModel.getByFamilyId(familyId, (err, registration) => {
          if (err) {
            console.error("Erreur récupération inscription:", err);
            return res.status(500).json({
              success: false,
              message: "Erreur serveur",
            });
          }

          if (children.length === 0) {
            return res.status(200).json({
              success: true,
              data: {
                family: {
                  id: family.id,
                  reference_number: family.reference_number,
                  address_line1: family.address_line1,
                  address_line2: family.address_line2,
                  postal_code: family.postal_code,
                  city: family.city,
                  phone_primary: family.phone_primary,
                  phone_secondary: family.phone_secondary,
                  email: family.email,
                },
                parents: parents || [],
                children: [],
                registration: registration
                  ? {
                      id: registration.id,
                      status: registration.status,
                      confirmed_at: registration.confirmed_at,
                      summary: registration.summary,
                    }
                  : null,
              },
            });
          }

          let processed = 0;
          const childrenWithDetails = [];

          children.forEach((child) => {
            AllergyModel.getByChildId(child.id, (err, allergies) => {
              if (err) {
                console.error("Erreur récupération allergies:", err);
              }
              CanteenScheduleModel.getDaysByChildId(child.id, (err, canteenDays) => {
                if (err) {
                  console.error("Erreur récupération planning cantine:", err);
                }
                childrenWithDetails.push({
                  ...child,
                  allergies: allergies || [],
                  canteen_days: canteenDays || [],
                });
                processed++;
                if (processed === children.length) {
                  childrenWithDetails.sort(
                    (a, b) => new Date(a.birth_date) - new Date(b.birth_date)
                  );
                  res.status(200).json({
                    success: true,
                    data: {
                      family: {
                        id: family.id,
                        reference_number: family.reference_number,
                        address_line1: family.address_line1,
                        address_line2: family.address_line2,
                        postal_code: family.postal_code,
                        city: family.city,
                        phone_primary: family.phone_primary,
                        phone_secondary: family.phone_secondary,
                        email: family.email,
                      },
                      parents: parents || [],
                      children: childrenWithDetails,
                      registration: registration
                        ? {
                            id: registration.id,
                            status: registration.status,
                            confirmed_at: registration.confirmed_at,
                            summary: registration.summary,
                          }
                        : null,
                    },
                  });
                }
              });
            });
          });
        });
      });
    });
  });
};

module.exports = {
  getResidentByEmail,
};
