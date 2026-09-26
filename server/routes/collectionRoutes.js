const express = require("express");
const router = express.Router();
const collectionController = require("../controllers/collectionController");
const commentController = require("../controllers/commentController");
const { authMiddleware } = require("../middlewares/authMiddleware");

router.post("/", authMiddleware, collectionController.createCollection);
router.get("/", authMiddleware, collectionController.getMyCollections);
router.get("/public", collectionController.getPublicCollections);
router.get("/:id", collectionController.getCollection);
router.put("/:id", authMiddleware, collectionController.updateCollection);
router.delete("/:id", authMiddleware, collectionController.deleteCollection);
router.post(
  "/:id/resources",
  authMiddleware,
  collectionController.addResourceToCollection,
);
router.delete(
  "/:id/resources/:resourceId",
  authMiddleware,
  collectionController.removeResourceFromCollection,
);
router.put(
  "/:id/visibility",
  authMiddleware,
  collectionController.updateCollectionVisibility,
);
router.post("/:id/like", authMiddleware, collectionController.toggleLike);

router.post("/:id/comments", authMiddleware, commentController.createComment);
router.get("/:id/comments", commentController.getComments);
router.put(
  "/:id/comments/:commentId",
  authMiddleware,
  commentController.updateComment,
);
router.delete(
  "/:id/comments/:commentId",
  authMiddleware,
  commentController.deleteComment,
);

module.exports = router;
