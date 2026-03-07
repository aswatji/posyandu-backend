// const express = require("express");
// const router = express.Router();
// const exportController = require("../controllers/exportController");

// // Kita pakai GET supaya gampang dites langsung lewat browser
// router.get("/sheets", exportController.exportKeSpreadsheet);

// module.exports = router;

const express = require("express");
const router = express.Router();

// Import controller (Sesuaikan path folder Anda)
const exportController = require("../controllers/exportController");

// Endpoint untuk diakses oleh frontend
router.get(
  "/export-excel-otomatis",
  exportController.exportKeSpreadsheetFullOtomatis,
);

module.exports = router;
