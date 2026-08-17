const User = require("../models/User");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();
const MA_PHRASE_SECRETE = process.env.JWT_SECRET;

// Fonction d'inscription
exports.registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Verifie si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email }).exec();

    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Cet email est déjà utilisé par un autre utilisateur" });
    }

    const newUser = await User.create({ username, email, password });

    res.status(201).json({
      message: "Utilisateur crée avec succès",
      utilisateurId: newUser._id,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const user = await User.findOne({ email }).exec();
    if (!user) {
      return res
        .status(401)
        .json({ error: "Identifiants incorrects : l'email n'existe pas" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ error: "Identifiants invalides : mot de passe incorrect" });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username },
      MA_PHRASE_SECRETE,
      { expiresIn: "24h" },
    );

    res.status(200).json({
      message: "Connexion réussie !",
      token: token,
      user: { id: user._id, username: user.username },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
