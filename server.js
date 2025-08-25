const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const mysql = require("mysql2/promise");

const app = express();
const cors = require('cors');
app.use(cors());
app.use(bodyParser.json());

const FILE_PATH = './data.json';


// Connexion à la base MySQL (PlanetScale par ex.)
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306
});
// Route pour ajouter une personne
app.post('/api/personnes', async  (req, res) => {
  const { name, password, email, confirmPassword } = req.body;

  if (!name || !password || !email || !confirmPassword) {
    return res.status(400).json({ message: "Tous les champs sont requis (name, password, email)" });
  }

  // Lire le fichier JSON existant
  try {
    const [result] = await pool.query(
      "INSERT INTO personnes (nom, prenom, email, confirmPassword) VALUES (?, ?, ?, ?)",
      [nom, prenom, email,confirmPassword]
    );

    res.status(201).json({
      message: "Personne ajoutée avec succès",
      personne: { id: result.insertId, nom, prenom, email }
    });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de l'ajout", error: err.message });
  }
});

// Récupérer toutes les personnes
app.get("/api/personnes", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM personnes");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la récupération", error: err.message });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`✅ Serveur lancé sur ${PORT}`);
});

module.exports = app;
