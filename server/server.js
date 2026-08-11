import express from "express";
import mongoose, { connect } from "mongoose";
import dotenv from "dotenv";

// Charger les variables d'environnement du fichier .env
dotenv.config();

const app = express();

const MONGO_URI = process.env.Mongo_URI;
const PORT = process.env.port;

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Connecté à MongoDB"))
  .catch((err) => console.error("Erreur Mongoose : ", err));

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(PORT, () => {
  console.log(`Le serveur est lancé sur le port ${PORT}`);
});
