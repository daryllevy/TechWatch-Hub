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
  const resources = await Resource.find().exec();
  res.json(resources);
};

exports.getResourceById = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id).exec();

    if (!resource)
      return res.status(404).json({ error: "Ressource introuvable" });

    res.json(resource);
  } catch (err) {
    res
      .status(500)
      .json({ error: "L'id fournit n'est pas valide ou mal formé" });
  }
};

// Modifier une ressource
exports.updateResource = async (req, res) => {
  try {
    const id = req.params.id;
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
    res
      .status(400)
      .json({
        error:
          "La requête envoyée est invalide : données manquantes ou mal formées",
      });
  }
};
