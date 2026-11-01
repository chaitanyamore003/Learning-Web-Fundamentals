const express = require("express");
const aiController = require("../controllers/ai.controller");
const router = express.Router();

router.post("/ask", aiController.askQuestion);

module.exports = router;
