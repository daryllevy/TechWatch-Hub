const express = require("express");
const router = express.Router();
const resourceController = require("../controllers/resourceController");
const { authMiddleware } = require("../middlewares/authMiddleware");

router.post("/", authMiddleware, resourceController.createResource);
router.get("/", resourceController.getAllResources);
router.get("/:id", resourceController.getResourceById);
router.put("/:id", resourceController.updateResource);
router.delete("/:id", resourceController.deleteResource);

module.exports = router;
