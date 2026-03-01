const express = require("express");
const router = express.Router();
const kkController = require("../controllers/kkController");
const { cekApiKey } = require("../middleware/authMiddleware");

// Terapkan satpam (cekApiKey) ke semua rute KK
router.use(cekApiKey);

router.get("/", kkController.getAllKK);
router.get("/:id", kkController.getKKById);
router.post("/", kkController.createKK);
router.put("/:id", kkController.updateKK);
router.delete("/:id", kkController.deleteKK);

module.exports = router;
