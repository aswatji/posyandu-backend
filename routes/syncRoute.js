const express = require("express");
const router = express.Router();
const syncController = require("../controllers/syncController");
const { cekApiKey } = require("../middleware/authMiddleware");

router.use(cekApiKey);

router.post("/", syncController.syncData);
// router.get("/pull", syncController.pullData);.
router.post("/pull", syncController.pullData);
router.get("/check-version", checkVersion);

module.exports = router;
