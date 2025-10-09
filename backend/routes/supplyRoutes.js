const express = require("express");
const router = express.Router();
const supplyController = require("../controllers/supplyController");

router.get("/test", supplyController.test);

router.post("/assign-material", supplyController.assignMaterial);
router.get("/assigned-materials", supplyController.getAssignedMaterials);

module.exports = router;