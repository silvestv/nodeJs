// DECLARE -----------------------------------------------------------------------------------

// imports ----------------------
// import mongoose pour faciliter les interactions avec une base mongoDB
const mongoose = require('mongoose');
// import du node_module express permettant démarrer un serveur node selon le framework express.js
const express = require('express');
//entry point ---------------------
// point d'entrée de l'app express
const app = express();
// Donne l'accès au chemin de notre système de fichier
const path = require('path');

// DECLARATIONS OF ROUTES ----------------------------------------------------------------------------
// routes (get, post, put, delete) des objets de l'application node
const stuffRoutes = require('./routes/stuff');
// routes (get, post, put, delete) des utilisateurs de l'application node
const userRoutes = require('./routes/user');

// CONNECTION TO DATABASE --------------------------------------------------------------------------
// Connect uri vers BDD mongoDB (username + password authentification)
const connectUri = 'mongodb+srv://admin_openclassroom:private_openclassroom@cluster0.cl0lg.mongodb.net/test?retryWrites=true&w=majority';
// cette commande permet de se connecter simplement grâce au package mongoose,
// à une base de donnée MongoDB (nosql) simple et gratuite (by Atlas)
mongoose.connect(connectUri,{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(_ => console.log('Connexion à MongoDb réussie ! '))
.catch(_ => console.log('Connexion à MongoDB a échoué ! '));


// MIDDLEWARE DE CONF -------------------------------------------------------------------------------

// Ce middleware intercepte toutes les requêtes qui ont un content-type json : accès au corps des requêtes
app.use(express.json());

// Ce middleware définit des en-têtes à la response permettant d'autorise les Cross-Origin pour cette ressource particulière (sauf ici puisqu'aucune route n'est définie)
app.use((req, res, next) => {
    // Les origines ayant accès aux datas (all)
    res.setHeader('Access-Control-Allow-Origin', '*');
    // On donne la permission d'utiliser certains en-têtes
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    // On donne la permission d'utiliser certains méthodes
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
})

//middleware permettant de servir le dossier images
// express static permet de servir la route image de manière statique comme
// un sous-dossier
app.use('/images', express.static(path.join(__dirname, 'images')));
// l'app gère l'api stuff via son router et son controller stuff
app.use('/api/stuff', stuffRoutes);
// l'app gère l'api d'authentification via son router user et son controller user
app.use('/api/auth', userRoutes);


// EXPORT --------------------------------------------------------------------------------------
// export app express pour que cette dernière soit accessible depuis le serveur node
module.exports = app;