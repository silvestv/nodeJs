// add User model bind to mongoose BDD 
const User = require('../models/User');
// package node bcrypt importé ici, pour crypter les passwords avant enregistrement en BDD
const bcrypt = require('bcrypt');

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

};