const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const cors = require('cors');
app.use(cors());
app.use(bodyParser.json());

const FILE_PATH = './data.json';

// Route pour ajouter une personne
app.post('/personnes', (req, res) => {
  const { name, password, email, confirmPassword } = req.body;

  if (!name || !password || !email || !confirmPassword) {
    return res.status(400).json({ message: "Tous les champs sont requis (name, password, email)" });
  }

  // Lire le fichier JSON existant
  fs.readFile(FILE_PATH, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ message: "Erreur lors de la lecture du fichier" });

    let personnes = [];
    try {
      personnes = JSON.parse(data);
    } catch (e) {
      personnes = [];
    }

    // Ajouter la nouvelle personne
    const nouvellePersonne = { id: Date.now(), name, password, email, confirmPassword };
    personnes.push(nouvellePersonne);

    // Réécrire le fichier
    fs.writeFile(FILE_PATH, JSON.stringify(personnes, null, 2), (err) => {
      if (err) return res.status(500).json({ message: "Erreur lors de l'écriture du fichier" });

      res.status(201).json({ message: "Personne ajoutée avec succès", personne: nouvellePersonne });
    });
  });
});

// Route pour récupérer toutes les personnes
app.get('/personnes', (req, res) => {
  fs.readFile(FILE_PATH, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ message: "Erreur lors de la lecture du fichier" });

    let personnes = [];
    try {
      personnes = JSON.parse(data);
    } catch (e) {
      personnes = [];
    }

    res.json(personnes);
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Serveur lancé sur http://localhost:${PORT}`);
});
