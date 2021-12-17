// DECLARE -----------------------------------------------------------------------------------

// imports ----------------------
// import mongoose pour faciliter les interactions avec une base mongoDB
const mongoose = require('mongoose');
// import du node_module express permettant démarrer un serveur node selon le framework express.js
const express = require('express');
// import du modèle mongoose simple
const Thing = require('./models/Thing');
//entry point ---------------------
// point d'entrée de l'app express
const app = express();

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

// MIDDLEWARE ----------------------------------------------------------------------------------
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

//Middleware PUT
app.put('/api/stuff/:id', (req, res, next) => {
    Thing.updateOne({ _id: req.params.id}, {...req.body, _id: req.params.id})
    .then(_ => res.status(200).json({ message: 'Objet modifié ! '}))
    .catch(error => res.status(400).json({error}));
});

app.delete('/api/stuff/:id', (req, res, next) =>{
    Thing.deleteOne({_id: req.params.id})
    .then(_ => res.status(200).json({message: 'Objet supprimé'}))
    .catch(error => res.status(400).json({ error }));
});

// Middleware POST
app.post('/api/stuff', (req, res, next) => {
    // Nous n'avons accès au body de request, uniquement grâce à use(express.json)
    // console.log(req.body); // pas de bdd pour l'instant => aucune persistence
    // res.status(201).json({
    //     message: 'Objet créé ! '
    // }); // reponse obligatoire (la data a été "créée")

    // With mongoDb
    // on retire l'id présent de base pour le laisser automatiquement généré par mongoDb
    delete req.body._id;
    // on génére une instance de notre modèle
    const thing = new Thing({
        ...req.body
    });
    // on save dans la db via la commande mongoose
    // on renvoie un retour de réponse sinon expiration de la requête
    thing.save()
    .then(_ => res.status(201).json({ message: 'Objet enregistré ! ' }))
    .catch(error => res.status(400).json({ error }));
});

// Middleware GET spécifique sur 1 objet
app.get('/api/stuff/:id', (req, res, next) => {
    // findOne() retourne un seul objet de la DB correpondant au schema mongoose pour un id spécifique
    Thing.findOne({ _id: req.params.id })
    // retour de succès au front-end
    .then(thing => res.status(200).json(thing))
    // retour d'echec
    .catch(error => res.status(404).json({ error }));
});

//Middleware GET : le premier argument '/api/stuff' de get() est un string correspondant à une route dans laquelle
// nous voulons stocker notre élément de réponse : http://localhost:port_d_ecoute/api/stuff
// etape real bdd : ce getter permet de récupérer TOUT les objets THING
app.get('/api/stuff', (req, res, next) => {
    // create a Object Json format
    // const stuff = [
    //   {
    //     _id: 'oeihfzeoi',
    //     title: 'Mon premier objet',
    //     description: 'Les infos de mon premier objet',
    //     imageUrl: 'https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg',
    //     price: 4900,
    //     userId: 'qsomihvqios',
    //   },
    //   {
    //     _id: 'oeihfzeomoihi',
    //     title: 'Mon deuxième objet',
    //     description: 'Les infos de mon deuxième objet',
    //     imageUrl: 'https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg',
    //     price: 2900,
    //     userId: 'qsomihvqios',
    //   },
    // ];
    // // on set la réponse à status 200 OK avec comme retour un objet JSON
    // res.status(200).json(stuff); // ---> ceci va générer depuis le front :4200 une erreur CORS car les origines sont différentes entre le front et les ressources back (:4200, :3000)
    //                              // ---> système de sécurité par défaut / pour pallier à cela nous devons ajouter des règles de sécurités dans l'en-tête de la response

    // With mongoDB
    // find() retourne tout les objets répondant au model mongoose Thing dans la db mongoDB
    Thing.find()
    // la promise en cas de succès retourne une réponse 200 et un json things au front-end
    .then(things => res.status(200).json(things))
    // sinon une erreur avec la raison de cette erreur
    .catch(error => res.status(400).json({ error }));
  });

// EXPORT --------------------------------------------------------------------------------------
// export app express pour que cette dernière soit accessible depuis le serveur node
module.exports = app;