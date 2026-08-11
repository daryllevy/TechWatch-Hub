import express from "express";
import mongoose, { connect } from "mongoose";
const app = express();
const port = 3000;
const mongoURI =
  "mongodb+srv://darylmvom01_db_user:azerty@cluster0.4elbwda.mongodb.net/?appName=Cluster0";

mongoose.connect(mongoURI).then(() => console.log("Connecté à MongoDB"));

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(port, () => {
  console.log(`Le serveur est lancé sur le port ${port}`);
});
