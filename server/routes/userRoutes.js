const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authMiddleware } = require("../middlewares/authMiddleware");

router.put("/me", authMiddleware, userController.updateProfile);

module.exports = router;
