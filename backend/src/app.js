/**
 * Application Express - API Cantine Scolaire
 */

const express = require("express");
const cors = require("cors");

// Initialisation de la base de données
const { initDatabase } = require("../db/init");

// Routes
const cantineRoutes = require("./routes/cantine.routes");
const familyRoutes = require("./routes/family.routes");
const registrationRoutes = require("./routes/registration.routes");
const allergyRoutes = require("./routes/allergy.routes");
const childRoutes = require("./routes/child.routes");
const pricingRoutes = require("./routes/pricing.routes");
const newsRoutes = require("./routes/news.routes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Route de santé
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "API Cantine Scolaire opérationnelle",
    timestamp: new Date().toISOString()
  });
});

// =============================================
// ROUTES API v1
// =============================================

// Anciennes routes (rétrocompatibilité)
app.use("/api/cantine", cantineRoutes);

// Nouvelles routes
app.use("/api/families", familyRoutes);
app.use("/api/inscription", registrationRoutes);
app.use("/api/inscriptions", registrationRoutes);
app.use("/api/allergies", allergyRoutes);
app.use("/api/children", childRoutes);
app.use("/api/pricing", pricingRoutes);
app.use("/api/news", newsRoutes);

// Route 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route non trouvée",
    path: req.originalUrl
  });
});

// Gestionnaire d'erreurs global
app.use((err, req, res, next) => {
  console.error("Erreur non gérée:", err);
  res.status(500).json({
    success: false,
    message: "Erreur serveur interne",
    error: process.env.NODE_ENV === "development" ? err.message : undefined
  });
});

// Initialise la base de données au démarrage
initDatabase()
  .then(() => {
    console.log("✅ Base de données prête");
  })
  .catch((err) => {
    console.error("❌ Erreur initialisation BDD:", err);
  });

module.exports = app;
