const express = require("express");
const router = express.Router();
const resourceController = require("../controllers/resourceController");
const { authMiddleware } = require("../middlewares/authMiddleware");

router.post("/", authMiddleware, resourceController.createResource);
router.get("/", authMiddleware, resourceController.getAllResources);
router.get("/:id", authMiddleware, resourceController.getResourceById);
router.put("/:id", authMiddleware, resourceController.updateResource);
router.delete("/:id", authMiddleware, resourceController.deleteResource);

module.exports = router;
