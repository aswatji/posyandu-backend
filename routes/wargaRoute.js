const express = require("express");
const router = express.Router();
const wargaController = require("../controllers/wargaController");
const { cekApiKey } = require("../middleware/authMiddleware");

router.use(cekApiKey);

router.get("/", wargaController.getAllWarga);
router.get("/kk/:nomorKK", wargaController.getWargaByKk);
router.post("/", wargaController.createWarga);
router.put("/:id", wargaController.updateWarga);
router.delete("/:id", wargaController.deleteWarga);

module.exports = router;
