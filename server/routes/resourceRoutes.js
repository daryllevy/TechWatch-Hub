const express = require("express");
const router = express.Router();
const resourceController = require("../controllers/resourceController");

router.post("/", resourceController.createResource);
router.get("/", resourceController.getAllResources);
router.get("/:id", resourceController.getResourceById);

module.exports = router;
