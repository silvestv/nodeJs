// DECLARE -----------------------------------------------------------------------------------
// import du node_module express permettant démarrer un serveur node selon le framework express.js
const express = require('express');
// point d'entrée de l'app express
const app = express();

// MIDDLEWARE ----------------------------------------------------------------------------------
app.use('/api/stuff', (req, res, next) => {
    const stuff = [
      {
        _id: 'oeihfzeoi',
        title: 'Mon premier objet',
        description: 'Les infos de mon premier objet',
        imageUrl: 'https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg',
        price: 4900,
        userId: 'qsomihvqios',
      },
      {
        _id: 'oeihfzeomoihi',
        title: 'Mon deuxième objet',
        description: 'Les infos de mon deuxième objet',
        imageUrl: 'https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg',
        price: 2900,
        userId: 'qsomihvqios',
      },
    ];
    res.status(200).json(stuff);
  });

// EXPORT --------------------------------------------------------------------------------------
// export app express pour que cette dernière soit accessible depuis le serveur node
module.exports = app;