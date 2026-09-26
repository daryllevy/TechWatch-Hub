const Note = require("../models/Note");
const Resource = require("../models/Resource");

exports.createNote = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id).exec();
    if (!resource) {
      return res.status(404).json({ error: "Ressource introuvable" });
    }

    const { content } = req.body;
    const note = await Note.create({
      content,
      resourceId: req.params.id,
      userId: req.user,
    });

    res.status(201).json(note);
  } catch (err) {
    // Code d'erreur Mongoose
    if (err.code === 11000) {
      return res
        .status(400)
        .json({ error: "Une note existe déjà sur cette ressource" });
    }
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ error: messages.join(", ") });
    }

    res.status(500).json({ error: err.message });
  }
};

exports.getNote = async (req, res) => {
  try {
    const note = await Note.findOne({
      resourceId: req.params.id,
      userId: req.user,
    }).exec();

    if (!note) {
      return res.status(404).json({ error: "Aucune note sur cette resource" });
    }

    res.status(200).json(note);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateNote = async (req, res) => {
  try {
    const { content } = req.body;
    const note = await Note.findOneAndUpdate(
      { resourceId: req.params.id, userId: req.user },
      { content },
      { new: true, runValidators: true },
    ).exec();
    if (!note) {
      return res
        .status(404)
        .json({ error: "Aucune note à modifier sur cette ressource" });
    }

    res.status(200).json(note);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteNote = async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({
      resourceId: req.params.id,
      userId: req.user,
    }).exec();
    if (!note) {
      return res
        .status(404)
        .json({ error: "Aucune note à supprimer sur cette ressource" });
    }

    res.status(200).json({ message: "Note supprimée avec succès" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
