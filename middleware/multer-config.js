//CONFIG DE MULTER : permettant la gestion de fichiers

// on importe multer : gestion de fichiers requete HTTP vers notre API
const multer = require('multer');

// mime type depuis le frontend
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
}

// obejt de configuration pour multer
// diskStorage() pour enregistrer sur notre disque
const storage = multer.diskStorage({
    // fct expliquant à multer dans quel dossier nous souhaitons enregistrer
    destination: (req, file, callback) => {
        callback(null, 'images')
    },
    // le nom du fichier à utiliser 
    filename: (req, file, callback) => {
        // nouveau nom du fichier + on evite les whitespaces 
        // (peut poser des soucis coté serveur)
        const name = file.originalname.split(' ').join('_');
        // creation de l'extension du fichier
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
        // nous avons ainsi créer un nom de fichier suffisament unique 
    }
})

//single() => fichier unique sagissant uniquement d'image
module.exports = multer({ storage }).single('image');