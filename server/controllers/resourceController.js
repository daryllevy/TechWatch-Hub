const Resource = require("../models/Resource");

// Fonction qui crée la ressource
exports.createResource = async (req, res) => {
  try {
    const { title, url, description, technology, level, status, tags } =
      req.body;
    const resource = await Resource.create({
      title,
      url,
      description,
      technology,
      level,
      status,
      tags,
      userId: req.user,
    });

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
    const resources = await Resource.find({ userId: req.user }).exec();
    res.json(resources);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des ressources" });
  }
};

exports.getResourceById = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id)
      .populate("userId", "username email") // remplace l'ObjectId par les vraies infos de l'utilisateur
      .exec();

    if (!resource)
      return res.status(404).json({ error: "Ressource introuvable" });

    if (resource.userId._id.toString() !== req.user.toString()) {
      return res.status(403).json({
        error: "Accès refusé : cette ressource ne vous appartient pas.",
      });
    }

    res.json(resource);
  } catch (err) {
    res
      .status(400)
      .json({ error: "L'id fournit n'est pas valide ou mal formé" });
  }
};

exports.updateResource = async (req, res) => {
  try {
    const id = req.params.id;

    const resource = await Resource.findById(id).exec();

    if (!resource)
      return res.status(404).json({ error: "La ressource n'existe pas" });

    if (resource.userId.toString() !== req.user.toString()) {
      return res.status(403).json({
        error: "Accès refusé : cette ressource ne vous appartient pas.",
      });
    }

    const { title, url, description, technology, level, status, tags } =
      req.body;

    const updatedResource = await Resource.findByIdAndUpdate(
      id,
      { title, url, description, technology, level, status, tags },
      {
        new: true,
        runValidators: true,
      },
    ).exec();

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

exports.updateResourceStatus = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id).exec();
    if (!resource) {
      return res.status(404).json({ error: "La ressource n'existe pas" });
    }

    if (resource.userId.toString() !== req.user.toString()) {
      return res.status(403).json({
        error: "Accès refusé : cette ressource ne vous appartient pas.",
      });
    }

    const { status } = req.body;
    const updatedResource = await Resource.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true },
    ).exec();

    res.status(200).json(updatedResource);
  } catch (err) {
    res.status(400).json({
      error:
        "La requête envoyée est invalide : données manquantes ou mal formées",
    });
  }
};

exports.deleteResource = async (req, res) => {
  try {
    const id = req.params.id;

    const resource = await Resource.findById(id).exec();

    if (!resource)
      return res.status(404).json({ error: "La ressource n'existe pas" });

    if (resource.userId.toString() !== req.user.toString()) {
      return res.status(403).json({
        error: "Accès refusé : cette ressource ne vous appartient pas.",
      });
    }

    const deletedResource = await Resource.findByIdAndDelete(id);

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
