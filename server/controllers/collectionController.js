const Collection = require("../models/Collection");
const Resource = require("../models/Resource");

exports.createCollection = async (req, res) => {
  try {
    let { title, description, isPublic, resources } = req.body;
    const userId = req.user;

    if (!resources) {
      resources = [];
    }

    const validResources = await Resource.find({
      _id: { $in: resources },
      userId: userId,
    }); // Vérifie si les ressources sont vraiment dans la collection Resource

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
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ error: messages.join(", ") });
    }
    res.status(500).json({ error: err.message });
  }
};
