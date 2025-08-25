const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Connexion MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Définir le modèle
const Personne = mongoose.model("Personne", {
  nom: String,
  password: String,
  email: String,
  confirmPassword: String
});

// Ajouter une personne
app.post("/api/personnes", async (req, res) => {
  try {
    const p = new Personne(req.body);
    await p.save();
    res.status(201).json({ message: "Ajout réussi", personne: p });
  } catch (err) {
    res.status(500).json({ message: "Erreur ajout", error: err.message });
  }
});

// Récupérer toutes les personnes
app.get("/api/personnes", async (req, res) => {
  try {
    const personnes = await Personne.find();
    res.json(personnes);
  } catch (err) {
    res.status(500).json({ message: "Erreur récupération", error: err.message });
  }
});

module.exports = app;
