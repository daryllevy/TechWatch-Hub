const Resource = require("../models/Resource");

// Fonction qui crée la ressource
exports.createResource = async (req, res) => {
  try {
    const { title, url, description, technology, level, status, tags } =
      req.body;
    const userId = req.user;
    const resource = await Resource.create({
      title,
      url,
      description,
      technology,
      level,
      status,
      tags,
      userId,
    });
    console.log("Ressource crée : ", resource);
    res.status(201).json(resource);
  } catch (err) {
    technology;
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ error: messages.join(", ") });
    }
    res.status(500).json({ error: err.message });
  }
};

// Lister toutes les ressources
exports.getAllResources = async (req, res) => {
  try {
    const resources = await Resource.find().exec();
    res.json(resources);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des ressources" });
  }
};

exports.getResourceById = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id).exec();

    if (!resource)
      return res.status(404).json({ error: "Ressource introuvable" });

    res.json(resource);
  } catch (err) {
    res
      .status(400)
      .json({ error: "L'id fournit n'est pas valide ou mal formé" });
  }
};

// Modifier une ressource
exports.updateResource = async (req, res) => {
  try {
    const id = req.params.id; // récupère l'Id dans l'url
    const updates = req.body;

    const updatedResource = await Resource.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).exec();

    if (!updatedResource) {
      return res.status(404).json({ error: "La ressource n'existe pas" });
    }

    res.status(200).json(updatedResource);
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ error: messages.join(", ") });
    }
    res.status(500).json({ error: err.message });
  }
};

// Supprimer une ressource
exports.deleteResource = async (req, res) => {
  try {
    const id = req.params.id;

    const deletedResource = await Resource.findByIdAndDelete(id);

    if (!deletedResource) {
      return res.status(404).json({ error: "La ressource n'existe pas" });
    }

    res.status(200).json({
      message: "Ressource supprimée avec succès",
      data: deletedResource,
    });
  } catch (err) {
    res.status(400).json({
      error:
        "La requête envoyée est invalide : données manquantes ou mal formées",
    });
  }
};
