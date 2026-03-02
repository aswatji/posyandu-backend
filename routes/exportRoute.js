const express = require("express");
const router = express.Router();
const exportController = require("../controllers/exportController");

// Kita pakai GET supaya gampang dites langsung lewat browser
router.get("/sheets", exportController.exportKeSpreadsheet);

module.exports = router;
