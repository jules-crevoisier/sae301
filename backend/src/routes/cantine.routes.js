const express = require("express");
const router = express.Router();

const cantineController = require("../controllers/cantine.controller");

router.post("/inscription", cantineController.inscription);

module.exports = router;
