const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const resourceSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    description: String,
    technology: {
      type: String,
      required: true,
    },
    level: String,
    status: {
      type: String,
      default: "à découvrir",
    },
    tags: [String],
    userId: Schema.Types.ObjectId,
  },
  {
    timestamps: true,
  },
);

// Création du model
module.exports = model("Resource", resourceSchema);
