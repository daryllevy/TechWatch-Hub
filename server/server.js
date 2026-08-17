const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const resourcesRoutes = require("./routes/resourceRoutes");
const userRoutes = require("./routes/userRoutes");

// Charger les variables d'environnement du fichier .env
dotenv.config();

const app = express();
app.use(express.json());

const MONGO_URI = process.env.Mongo_URI;
const PORT = process.env.port;

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Connecté à MongoDB"))
  .catch((err) => console.error("Erreur Mongoose : ", err));

// MES ROUTES
app.use("/api/resources", resourcesRoutes);
app.use("/api/auth", userRoutes);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(PORT, () => {
  console.log(`Le serveur est lancé sur le port ${PORT}`);
});
