const express = require("express");
const router = express.Router();
const collectionRessources = require("../controllers/collectionController");
const { authMiddleware } = require("../middlewares/authMiddleware");

router.post("/", authMiddleware, collectionRessources.createCollection);
router.get("/", authMiddleware, collectionRessources.getMyCollections);

module.exports = router;
