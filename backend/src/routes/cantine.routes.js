const express = require("express");
const router = express.Router();

const cantineController = require("../controllers/cantine.controller");

router.post("/inscription", cantineController.inscription);
router.get("/", cantineController.getAllInscriptions);
router.get("/:id", cantineController.getInscriptionById);
router.put("/:id", cantineController.updateInscription);
router.delete("/:id", cantineController.deleteInscription);

module.exports = router;
