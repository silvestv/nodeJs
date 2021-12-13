const mongoose = require('mongoose');

// grâce à Mongoose, nous créons un schéma de donnée simple)
// inutile de mettre l'id, mongoose le gère automatiquement
const ThingSchema = mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    imageUrl: {type: String, required: true},
    userId: {type: String, required: true},
    price: {type: Number, required: true}
});

// Puis nous exportons cd modèle de données sous forme de schéma grâce à mongoose
// en lui donnant un nom et un schéma de description associé
// la méthode model() de mongoose transforme ce schéma en modèle utilisable par notre application express
module.exports = mongoose.model('Thing', ThingSchema);
