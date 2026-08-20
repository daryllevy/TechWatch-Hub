const User = require("../models/User");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();
const MA_PHRASE_SECRETE = process.env.JWT_SECRET;

// Fonction d'inscription
exports.registerUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const email = req.body.email.toLowerCase().trim();

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
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ error: messages.join(", ") });
    }
    res.status(500).json({ error: err.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const email = req.body.email.toLowerCase().trim();

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

exports.updateProfile = async (req, res) => {
  try {
    const id = req.user;
    const { username } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { username },
      {
        new: true,
        runValidators: true,
      },
    ).select("-password"); //exclut le hash du mot de passe de la réponse

    res.status(200).json(updatedUser);
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ error: messages.join(", ") });
    }
    res.status(500).json({ error: err.message });
  }
};
