// import du node_module express permettant démarrer un serveur node selon le framework express.js
const express = require('express');
// point d'entrée de l'app1 express
const app1 = express();

//pre middleware
app1.use((req, res, next) => {
    console.log('requete recue ...');
    // app1el le prochain middleware 
    next();
});

// pre middleware
app1.use((req, res, next) => {
    // envoyer un code 201
    res.status(201);
    next();
});

// use sert à passer la requete et reponse (first middleware), next permet de passer à la fonction suivante
// l'execution du serveur
app1.use((req, res, next) => {
    // envoyer une réponse JSON
    res.json('Muy bien mi amigo VictorS !');
    next();
});

app1.use((req, res) => {
    // envoyer une réponse JSON
   console.log('reponse recue avec succès !! ');
});

// export app1 express pour que cette dernière soit accessible depuis le serveur node
module.exports = app1;
