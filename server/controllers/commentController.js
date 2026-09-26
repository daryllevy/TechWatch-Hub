const Comment = require("../models/Comment.js");
const Collection = require("../models/Collection.js");

exports.createComment = async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id).exec();
    if (!collection) {
      return res.status(404).json({ error: "Cette collection n'existe pas" });
    }

    if (!collection.isPublic) {
      return res
        .status(403)
        .json({ error: "Impossible de commenter une collection privée" });
    }

    const { content } = req.body;
    const comment = await Comment.create({
      content,
      collectionId: req.params.id,
      userId: req.user,
    });

    const populated = await comment.populate("userId", "username");
    res.status(201).json(populated);
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ error: messages.join(", ") });
    }
    res.status(500).json({ error: err.message });
  }
};

exports.getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ collectionId: req.params.id })
      .populate("userId", "username")
      .sort({ createdAt: 1 })
      .exec();
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId).exec();
    if (!comment) {
      return res.status(404).json({ error: "Commentaire introuvable" });
    }

    if (comment.userId.toString() !== req.user.toString()) {
      return res.status(403).json({
        error: "Accès refusé : ce Commentaire ne vous appartient pas.",
      });
    }

    const { content } = req.body;
    comment.content = content;
    await comment.save();
    res.status(200).json(comment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId).exec();
    if (!comment)
      return res.status(404).json({ error: "Commentaire introuvable." });

    if (comment.userId.toString() !== req.user.toString()) {
      return res.status(403).json({
        error: "Accès refusé : ce commentaire ne vous appartient pas.",
      });
    }

    await Comment.findByIdAndDelete(req.params.commentId);
    res.status(200).json({ message: "Commentaire supprimé avec succès" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
