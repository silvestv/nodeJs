const express = require('express');

// DECLARE -------------------------------------------------------------------------------------------------

const router = express.Router();

const stuffController = require('../controllers/stuff');

// MIDDLEWARE ROUTE----------------------------------------------------------------------------------

// Middleware POST
// le endpoint est géré par un router, la logique du endpoint est détenue par un controller
router.post('/', stuffController.createThings);

// Middleware GET spécifique sur 1 objet
router.get('/:id', stuffController.getOneThing);

//Middleware GET : le premier argument '/api/stuff' de get() est un string correspondant à une route dans laquelle
// nous voulons stocker notre élément de réponse : http://localhost:port_d_ecoute/api/stuff
// etape real bdd : ce getter permet de récupérer TOUT les objets THING
router.get('/', stuffController.getThings);

  //Middleware PUT
router.put('/:id', stuffController.modifyThing);

//Middleware Delete
router.delete('/:id', stuffController.deleteThing);

// ----------------------------------------------------------------------------------------------

module.exports = router;