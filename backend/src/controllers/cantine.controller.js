const Cantine = require("../models/cantine.model");

exports.inscription = (req, res) => {
  const {
    nom,
    prenom,
    classe,
    email_parent,
    regime_alimentaire
  } = req.body;

  if (
    !nom ||
    !prenom ||
    !classe ||
    !email_parent ||
    !regime_alimentaire
  ) {
    return res.status(400).json({
      message: "Tous les champs sont obligatoires"
    });
  }

  Cantine.createInscription(req.body, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        message: "Erreur lors de l'enregistrement"
      });
    }

    res.status(201).json({
      message: "Inscription à la cantine enregistrée"
    });
  });
};
