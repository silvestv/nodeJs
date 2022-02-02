// Ici ce trouvera la logique métier de l'application, et des routes
// Ceci est donc un controller

// import du modèle mongoose simple
const Thing = require('../models/Thing');

// import filsystem pour avoir accès au operation de fichier system
const fileSystem = require('fs');

// CONTROLLER STUFF FRO EACH ENDPOINT -------------------------------------------------------------------------

// ANCIEN controller for post stuff route
//fonction permettant de contenir la logique métier de la route post 
// et donc de la création d'objet Json
// exports.createThings = (req, res, next) => {
// Nous n'avons accès au body de request, uniquement grâce à use(express.json)
    // console.log(req.body); // pas de bdd pour l'instant => aucune persistence
    // res.status(201).json({
    //     message: 'Objet créé ! '
    // }); // reponse obligatoire (la data a été "créée")

    // With mongoDb
    // on retire l'id présent de base pour le laisser automatiquement généré par mongoDb
    // delete req.body._id;
    // on génére une instance de notre modèle
    // const thing = new Thing({
        // ...req.body
    // });
    // on save dans la db via la commande mongoose
    // on renvoie un retour de réponse sinon expiration de la requête
    // thing.save()
    // .then(_ => res.status(201).json({ message: 'Objet enregistré ! ' }))
    // .catch(error => res.status(400).json({ error }));
//};

// NOUVEAU controller for post stuff route
// Pour ajouter un fichier à la requête, le front-end doit envoyer les données 
// de la requête sous la forme form-data, et non sous forme de JSON. 
// Le corps de la requête contient une chaîne thing , qui est simplement 
// un objet Thing converti en chaîne. Nous devons donc l'analyser à l'aide 
// de JSON.parse() pour obtenir un objet utilisable.
exports.createThings = (req, res, next) => {
    // With multer 
    // extraction - transformation du body json en un js Object
    const thingObject = JSON.parse(req.body.thing);
    delete thingObject._id;
    const thing = new Thing({
        ...thingObject,
        // Quel est l'url de l'image depuis que multer le génère grace au fichier
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    thing.save()
    .then(_ => res.status(201).json({ message: 'Objet enregistré ! ' }))
    .catch(error => res.status(400).json({ error }));
};

// logique du endpoint put (router)
exports.modifyThing = (req, res, next) => {
    // modifie t'on avec ou sans nouvelle image ? --> requete différente
    const thingObject = req.file ?
     { 
         ...JSON.parse(req.body.thing),
         imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
     } 
     : { ...req.body };
    Thing.updateOne({ _id: req.params.id}, {...thingObject, _id: req.params.id})
    .then(_ => res.status(200).json({ message: 'Objet modifié ! '}))
    .catch(error => res.status(400).json({error}));
};

// logique du endpoint delete (router)
exports.deleteThing = (req, res, next) =>{

    // On récupère le thing pour checker son userId avec celui de 
    // req.auth.userId ajouter en propriété dans le middleware
    // auth.js
    Thing.findOne({ _id: req.params.id }).then(
        (thing) => {
            // Si l'objet n'existe pas en bdd
            if (!thing) {
                return res.status(404).json({
                    error: new Error('Objet non trouvé ! ')
                });
            }
            // si l'objet n'appartient pas à l'utilisateur connecté
            if (thing.userId !== req.auth.userId) {
                return res.status(401).json({
                    error: new Error('Requête non authorisée ! ')
                });
            } else {
            // sinon poursuivre la suppression

            // On veut supprimer un fichier
                const filename = thing.imageUrl.split('/images/')[1];
                // unlink() du package fileSystem permet de supprimer un fichier
                fileSystem.unlink(`images/${filename}`, () => {
                    Thing.deleteOne({_id: req.params.id})
                    .then(_ => res.status(200).json({message: 'Objet supprimé'}))
                    .catch(error => res.status(400).json({ error }));
                });
            }
        }
    );

};

// logique du endpoint get :id (router)
exports.getOneThing = (req, res, next) => {
    // findOne() retourne un seul objet de la DB correpondant au schema mongoose pour un id spécifique
    Thing.findOne({ _id: req.params.id })
    // retour de succès au front-end
    .then(thing => res.status(200).json(thing))
    // retour d'echec
    .catch(error => res.status(404).json({ error }));
};

// logique du endpoint get (router)
exports.getThings = (req, res, next) => {
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
  };

  // -------------------------------------------------------------------------------------------------