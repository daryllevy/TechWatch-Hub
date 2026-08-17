const User = require("../models/User");

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
    res.status(500).json({ error: "Une erreur côté serveur est survenue" });
  }
};
