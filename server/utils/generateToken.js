const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();
const MA_PHRASE_SECRETE = process.env.JWT_SECRET;

function generateToken(user) {
  return jwt.sign(
    { id: user._id, username: user.username },
    MA_PHRASE_SECRETE,
    { expiresIn: "24h" },
  );
}

module.exports = generateToken;
