const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const collectionSchema = Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  isPublic: {
    type: Boolean,
    default: true,
  },
  resources: [{ type: Schema.Types.ObjectId, ref: "Resource" }],
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  likesCount: { type: Number, default: 0 },
  likedBy: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  viewCount: { type: Number, default: 0 },
});

module.exports = model("Collection", collectionSchema);
