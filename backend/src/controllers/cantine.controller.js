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

exports.getAllInscriptions = (req, res) => {
  Cantine.getAllInscriptions((err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        message: "Erreur lors de la récupération des inscriptions"
      });
    }

    res.status(200).json(rows);
  });
};

exports.getInscriptionById = (req, res) => {
  const { id } = req.params;

  Cantine.getInscriptionById(id, (err, row) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        message: "Erreur lors de la récupération de l'inscription"
      });
    }

    if (!row) {
      return res.status(404).json({
        message: "Inscription non trouvée"
      });
    }

    res.status(200).json(row);
  });
};

exports.updateInscription = (req, res) => {
  const { id } = req.params;
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

  Cantine.updateInscription(id, req.body, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        message: "Erreur lors de la modification de l'inscription"
      });
    }

    res.status(200).json({
      message: "Inscription modifiée avec succès"
    });
  });
};

exports.deleteInscription = (req, res) => {
  const { id } = req.params;

  Cantine.deleteInscription(id, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        message: "Erreur lors de la suppression de l'inscription"
      });
    }

    res.status(200).json({
      message: "Inscription supprimée avec succès"
    });
  });
};