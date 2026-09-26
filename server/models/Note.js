const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const noteSchema = new Schema(
  {
    content: { type: String, require: true },
    resourceId: { type: Schema.Types.ObjectId, ref: "Resource", require: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", require: true },
  },
  { timestamps: true },
);

noteSchema.index({ resourceId: 1, userId: 1 }, { unique: true }); //pour éviter les doublons
module.exports = model("Note", noteSchema);
