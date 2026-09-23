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

    res.status(200).json(myCollections);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

exports.getCollection = async (req, res) => {
  try {
    const collectionId = req.params.id;

    const collection = await Collection.findById(collectionId).populate('resources').exec();

    if (!collection) {
      return res.status(404).json({ error: "Cette collection n'existe pas" });
    }

    const isAccessible = collection.isPublic;

    if (!isAccessible) {
      return collection.userId.toString() == req.user.toString()
        ? res.status(200).json(collection)
        : res.status(403).json({ error: "Accès interdit à la collection" });
    }

    res.status(200).json(collection);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateCollection = async (req, res) => {
  try {
    const collectionId = req.params.id;

    const collection = await Collection.findById(collectionId).exec();

    if (!collection) {
      return res.status(404).json({ error: "Cette collection n'existe pas." });
    }

    if (collection.userId.toString() !== req.user.toString()) {
      return res.status(403).json({
        error:
          "Accès refusé : Vous n'êtes pas le propriétaire de cette collection.",
      });
    }

    const { title, description, isPublic } = req.body;

    const updatedCollection = await Collection.findByIdAndUpdate(
      collectionId,
      { title, description, isPublic },
      { new: true, runValidators: true },
    ).exec();
    res.status(200).json(updatedCollection);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteCollection = async (req, res) => {
  try {
    const collectionId = req.params.id;

    const collection = await Collection.findById(collectionId).exec();

    if (!collection) {
      return res.status(404).json({ error: "Cette collection n'existe pas." });
    }

    if (collection.userId.toString() !== req.user.toString()) {
      return res.status(403).json({
        error:
          "Accès refusé : Vous n'êtes pas le propriétaire de cette collection.",
      });
    }

    const deletedCollection =
      await Collection.findByIdAndDelete(collectionId).exec();

    res.status(200).json({
      message: "Collection supprimée avec succès.",
      data: deletedCollection,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.addResourceToCollection = async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id).exec();
    if (!collection) {
      return res.status(404).json({ error: "Cette collection n'existe pas." });
    }

    if (collection.userId.toString() !== req.user.toString()) {
      return res.status(403).json({
        error:
          "Accès refusé : vous n'êtes pas le propriétaire de cette collection.",
      });
    }

    const { resourceId } = req.body;
    const resource = await Resource.findOne({
      _id: resourceId,
      userId: req.user,
    }).exec();

    if (!resource) {
      return res
        .status(400)
        .json({ error: "Ressource invalide ou ne vous appartenant pas." });
    }

    if (collection.resources.some((r) => r.toString() === resourceId)) {
      return res
        .status(400)
        .json({ error: "Cette ressource est déjà dans la collection." });
    }

    collection.resources.push(resourceId);
    await collection.save();
    res.status(200).json(collection);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.removeResourceFromCollection = async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id).exec();
    if (!collection) {
      return res.status(404).json({ error: "Cette collection n'existe pas." });
    }

    if (collection.userId.toString() !== req.user.toString()) {
      return res.status(403).json({
        error:
          "Accès refusé : vous n'êtes pas le propriétaire de cette collection.",
      });
    }

    collection.resources = collection.resources.filter(
      (r) => r.toString() !== req.params.resourceId,
    );

    await collection.save();
    res.status(200).json({ collection });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
