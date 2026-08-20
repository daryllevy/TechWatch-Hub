const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const MA_PHRASE_SECRETE = process.env.JWT_SECRET;

exports.authMiddleware = (req, res, next) => {
  // Récupère le bage dans l'en-tête
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "en-tête absent" });

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Accès refusé: aucun token fourni" });
  }
  try {
    // Vérifie la validité du token
    const decoded = jwt.verify(token, MA_PHRASE_SECRETE);

    req.user = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ error: "Token invalide ou expiré" });
  }
};
