// Lokasi: routes/authRoute.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Rute untuk Register dan Login
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/upload-foto", authController.uploadFoto);

module.exports = router;
