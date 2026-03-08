import express from "express";
import {
  upsertDataKeluarga,
  getDataKeluargaByKK,
} from "../controllers/dataKeluargaController";

const router = express.Router();

// Route untuk menyimpan atau mengupdate data (POST)
router.post("/", upsertDataKeluarga);

router.get("/:nomorKkRel", getDataKeluargaByKK);

export default router;
