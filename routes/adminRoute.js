const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

// Jalur untuk mengambil semua data gabungan Warga & KK
router.get("/semua-data", adminController.getAllDataForAdmin);

module.exports = router;
