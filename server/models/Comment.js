const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const commentSchema = new Schema(
  {
    content: { type: String, require: true },
    collectionId: {
      type: Schema.Types.ObjectId,
      ref: "Collection",
      require: true,
    },
    userId: { type: Schema.Types.ObjectId, ref: "User", require: true },
  },
  { timestamps: true },
);

module.exports = model("Comment", commentSchema);
