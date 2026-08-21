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

exports.getMyCollections = async (req, res) => {
  try {
    const myCollections = await Collection.find({ userId: req.user }).exec();

    if (myCollections.length === 0) {
      return res
        .status(200)
        .json({ error: "Vous n'avez pas encore de collection, créez-en" });
    }

    res.status(200).json({ myCollections });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

exports.getCollection = async (req, res) => {
  try {
    const collectionId = req.params.id;

    const collection = await Collection.findById(collectionId).exec();

    if (!collection) {
      return res.status(404).json({ error: "Cette collection n'existe pas" });
    }

    const isAccessible = collection.isPublic;

    if (!isAccessible) {
      return collection.userId == req.user
        ? res.status(200).json(collection)
        : res.status(403).json({ error: "Accès interdit à la collection" });
    }

    res.status(200).json(collection);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
