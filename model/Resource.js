import mongoose from "mongoose";
import { type } from "node:os";
const { Schema, model } = mongoose;

const resource = new Schema(
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
    status: String,
    tag: String,
  },
  {
    timestamps: true,
  },
);

// Création du model
const Resource = model("Resource", resource);
export default Resource;
