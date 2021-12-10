// import du node_module express permettant démarrer un serveur node selon le framework express.js
const express = require('express');
// point d'entrée de l'app express
const app = express();

//pre middleware
app.use((req, res, next) => {
    console.log('requete recue ...');
    // appel le prochain middleware 
    next();
});

// pre middleware
app.use((req, res, next) => {
    // envoyer un code 201
    res.status(201);
    next();
});

// use sert à passer la requete et reponse (first middleware), next permet de passer à la fonction suivante
// l'execution du serveur
app.use((req, res, next) => {
    // envoyer une réponse JSON
    res.json('Muy bien mi amigo VictorS !');
    next();
});

app.use((req, res) => {
    // envoyer une réponse JSON
   console.log('reponse recue avec succès !! ');
});

// export app express pour que cette dernière soit accessible depuis le serveur node
module.exports = app;
