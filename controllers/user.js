// add User model bind to mongoose BDD 
const User = require('../models/User');
// package node bcrypt importé ici, pour crypter les passwords avant enregistrement en BDD
const bcrypt = require('bcrypt');
// package node jsonwebtoken permet de créer des token et de les vérifier
const jwt = require('jsonwebtoken');

// middelware pour l'enregistrement d'un nouvel utilisateur
exports.signup = (req, res, next) => {
    // hashage assynchrone du mdp (salt = 10 suffisant pour un mdp sécuriser
    // plus il y a de tours plus l'algorithme de cryptage prend du temps)
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                // on remplie l'user mongoose password avc le hash
                password: hash
            });
            // on sauvegarde l'user en BDD
            user.save()
                .then(_ => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

// middelware pour l'authentification d'un utilisateur
exports.login = (req, res, next) => {
    // On commence par trouvé le User en BDD qui correspond à l'email remplit
    // par l'utilisateur, on renvoit une erreur sinon
    User.findOne({email: req.body.email })
        .then(user => {
            if( !user ) {
                return res.status(401).json({ error: 'Utilisateur non trouvé ! '});
            }
            // Si on possède un utilisateur, on compage le mdp de la requete avec
            // le hash en BDD via bcrypt
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    // si le mdp est faux
                    if( !valid ) {
                        return res.status(401).json({ error: 'Mot de passe incorrect ! ' });
                    }
                    // sinon on retourne l'userid + un token à renvoyer vers le front-end pour 
                    // permettre l'authentification
                    res.status(200).json({
                        userId: user._id,
                        // on envoie au front end un token d'authentification qui permettra
                        // de svaoir si chaque requêtes futures sont identifées
                        token: jwt.sign(
                            // payload => données que l'on souhaite encodées dans le token
                           { userId: user._id },
                           // clef secrête pour l'encodage (en prod nous utiliserions une chaines complexe et aléatoire)
                           'RANDOM_TOKEN_SECRET', 
                           // expiration du token (avant que l'utilisateur ne doive se reconnecter)
                           { expiresIn: '24h'}
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        // uniquement si on a un pb de connexion ou autres (pas si on a pas trouvé de user)
        // auquel cas nous auront un retour vide (et non en erreur)
        .catch(error => res.status(500).json({ error }));
};