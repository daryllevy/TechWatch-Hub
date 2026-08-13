const Resource = require("../models/Resource");

// Fonction qui crée la ressource
exports.createResource = async (req, res) => {
  try {
    const resource = await Resource.create(req.body);
    res.status(201).json(resource);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Lister toutes les ressources
exports.getAllResources = async (req, res) => {
  const resources = await Resource.find();
  res.json(resources);
};

exports.getResource = async (req, res) => {
  const resource = await Resource.findById(req.params.id);

  if (!resource)
    return res.status(404).json({ error: "Ressource introuvable" });

  res.json(resource);
};
