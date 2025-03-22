require('dotenv').config();
const express = require('express');
const bot = require('./bot'); // Importation de bot.js

const app = express();

// Route pour tester si le bot fonctionne
app.get('/', (req, res) => {
    res.send("Le bot TikTok fonctionne !");
});

// Démarrage du serveur Express
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Serveur en ligne sur le port ${PORT}`));