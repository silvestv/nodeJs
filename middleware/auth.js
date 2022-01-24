const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        // Nous connaissons déjà la forme du token dans la partie authorisation du header :
        // "Bearer chaineDeNotreToken" il y a donc un espace qui les séparent
        const token = req.headers.authorization.split(' ')[1];
        // permet de vérifier la justesse du token selon notre key
        // si on échoue nous levons une erreur
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        // le userId se trouve normalement dans le decodedToken, vu que c'est lui qu'on a encodé dans
        // le login
        const userId = decodedToken.userId
        // Si jamais il y a un userId dans le corps de la requête est différetn du userId du token

        // PARADE FAILLE DE SECURITE :
        // on ajoute ici le parametre userId à la racine de la requete
        // pour le récpérer sur le controller delete
        req.auth = { userId: userId}; // --> raccourci js (affection clé - valeur du même nom)
                                      // --> req.auth = { userId }
        if(req.body.userId && req.body.userId !== userId) {
            // on veut lever un erreur, on refuse d'authentifier
            throw new Error('User ID non valable !');
        } else {
            // sinon nous laissons filer ... 
            // (ce middleware étant appliquer sur chaque route protégée)
            next();
            // FAILLE DE SECURITE : 
            // la route delete ne possède pas de userId dans son body
            // par conséquent un utilisateur peut supprimer un objet qui ne lui appartient pas
        }
    } catch (error) {
        res.status(401).json({ error: error | 'Requête non authentifiée'});
    }
};