const Collection = require("../models/Collection");
const Resource = require("../models/Resource");

// 1. Le client envoie req.body avec le titre, la description, isPublic, resources,
// userId(comment je vais le récupérer?)
// 2. j'utilise la méthode create de mongoose pour créer la collection et je stcke dans
// la variable newCollection
// 3. je renvoie la nouvelle collection en cas de succès
// 4. en cas d'échec je renvoie un message 400 données manquantes ou mal formulées
exports.createCollection = async (req, res) => {
  try {
    const { title, description, isPublic, resources } = req.body;
    const userId = req.user;

    const validResources = await Resource.find({ _id: { $in: resources } }); // Vérifie si les ressources sont vraiment dans la collection Resource

    if (validResources.length !== resources.length) {
      return res.status(400).json({ error: "données invalides" });
    }

    const newCollection = await Collection.create({
      title,
      description,
      isPublic,
      resources,
      userId,
    });

    res.status(201).json(newCollection);
    console.log("La collection créé: ", newCollection);
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ error: messages.join(", ") });
    }

    res.status(500).json({ error: err.message });
  }
};
