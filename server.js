// Use npm package 'nodemon' for launch the server with automatic restart due to code modification & save

console.log('hola que tal node server ?');
// nous avons besoin du package http de node pour créer un serveur
const http = require('http');
//besoin du point d'entrée de l'app express.js pour servir le serveur node
const app = require('./app');
// create une instance de node serveur custom simple
// const server = http.createServer((req, res) => {
//     // end signifie que la réponse n'écrira rien de plus
//     res.end('Muy bien mi amigo VictorS !');
// }); 

const normalizePort = val => {
    const port = parseInt(val, 10);
  
    if (isNaN(port)) {
      return val;
    }
    if (port >= 0) {
      return port;
    }
    return false;
};

const port = normalizePort(process.env.PORT || '3000');

// Nous avons besoin de spécifier sur quel port l'app express va tourner
app.set('port', port);

const errorHandler = error => {
    if (error.syscall !== 'listen') {
      throw error;
    }
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges.');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(bind + ' is already in use.');
        process.exit(1);
        break;
      default:
        throw error;
    }
  };

// create une instance de node serveur avec une app express.js comme structure de req - res
const server = http.createServer(app);

server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

// l'instance du serveur créé écoute (attend un requête) sur le port 3000 par défaut,
// si ce dernier est utilisé alors on écoute la variable d'env PORT
server.listen(3000 || process.env.PORT);

