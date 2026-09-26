const express = require("express");
const router = express.Router();
const resourceController = require("../controllers/resourceController");
const noteController = require("../controllers/noteController");
const { authMiddleware } = require("../middlewares/authMiddleware");

router.post("/", authMiddleware, resourceController.createResource);
router.get("/", authMiddleware, resourceController.getAllResources);
router.get("/:id", authMiddleware, resourceController.getResourceById);
router.put("/:id", authMiddleware, resourceController.updateResource);
router.put(
  "/:id/status",
  authMiddleware,
  resourceController.updateResourceStatus,
);
router.delete("/:id", authMiddleware, resourceController.deleteResource);

router.post("/:id/notes", authMiddleware, noteController.createNote);
router.get("/:id/notes", authMiddleware, noteController.getNote);
router.put("/:id/notes", authMiddleware, noteController.updateNote);
router.delete("/:id/notes", authMiddleware, noteController.deleteNote);

module.exports = router;
