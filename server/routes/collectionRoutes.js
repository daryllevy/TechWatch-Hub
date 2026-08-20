const express = require("express");
const router = express.Router();
const { createCollection } = require("../controllers/collectionController");
const { authMiddleware } = require("../middlewares/authMiddleware");

router.post("/", authMiddleware, createCollection);

module.exports = router;
