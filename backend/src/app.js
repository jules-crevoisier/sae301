const express = require("express");
const cors = require("cors");

const cantineRoutes = require("./routes/cantine.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/cantine", cantineRoutes);

module.exports = app;
