const mongoose = require('mongoose');

// add mongoose-unique-validator comme plugin a notre schema
// pour avoir des logs explicites des erreurs
// possibles en cas de non respect d'un mail unique
const uniqueValidator = require('mongoose-unique-validator');

//mongoose schema (obj mongoose) userSchema qui définit la structure en BDD
// d'un user
const userSchema = mongoose.Schema({
    // unique signifie qu'un utilisateur ne peut pas créer 
    // 2 compte avec la même adresse mail
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);

// modèle de donnée utilisable par l'application NodeJs
module.exports = mongoose.model('User', userSchema);

