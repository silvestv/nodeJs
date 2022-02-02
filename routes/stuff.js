const express = require('express');

// DECLARE -------------------------------------------------------------------------------------------------

const router = express.Router();

const stuffController = require('../controllers/stuff');

// on importe ici notre middleware d'authentification qui vérifie notre token
const authMiddleware = require('../middleware/auth');

//import fu middleware permettant la gestion de fichier (multer)
const multerMiddleware = require('../middleware/multer-config');


// MIDDLEWARE ROUTE----------------------------------------------------------------------------------

// On applique la vérification d'une authentidfication correcte sur 
// chaque opération permettant de traiter la donnée

// Middleware POST
// le endpoint est géré par un router, la logique du endpoint est détenue par un controller
router.post('/', authMiddleware, multerMiddleware, stuffController.createThings);

// Middleware GET spécifique sur 1 objet
router.get('/:id', authMiddleware, stuffController.getOneThing);

//Middleware GET : le premier argument '/api/stuff' de get() est un string correspondant à une route dans laquelle
// nous voulons stocker notre élément de réponse : http://localhost:port_d_ecoute/api/stuff
// etape real bdd : ce getter permet de récupérer TOUT les objets THING
router.get('/', authMiddleware, stuffController.getThings);

  //Middleware PUT
router.put('/:id', authMiddleware, multerMiddleware, stuffController.modifyThing);

//Middleware Delete
router.delete('/:id', authMiddleware, stuffController.deleteThing);

// ----------------------------------------------------------------------------------------------

module.exports = router;