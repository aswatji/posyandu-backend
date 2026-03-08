const express = require("express");
const {
  upsertDataKeluarga,
  getDataKeluargaByKK,
} = require("../controllers/dataKeluargaController");

const router = express.Router();

// Route untuk menyimpan atau mengupdate data (POST)
router.post("/", upsertDataKeluarga);

// Route untuk mengambil data berdasarkan Nomor KK (GET)
router.get("/:nomorKkRel", getDataKeluargaByKK);

module.exports = router;
