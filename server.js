// Use npm package 'nodemon' for launch the server with automatic restart due to code modification & save

console.log('hola que tal node server ?');
// nous avons besoin du package http de node pour créer un serveur
const http = require('http');
// create une instance de node serveur custom
const server = http.createServer((req, res) => {
    // end signifie que la réponse n'écrira rien de plus
    res.end('Muy bien mi amigo VictorS !');
}); 

// l'instance du serveur créé écoute (attend un requête) sur le port 3000 par défaut,
// si ce dernier est utilisé alors on écoute la variable d'env PORT
server.listen(3000 || process.env.PORT);

