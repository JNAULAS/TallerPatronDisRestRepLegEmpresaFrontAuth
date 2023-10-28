/*  Importanción de  metodos de varios direstorios */
const express = require('express')
const body_parser = require('body-parser')
const config = require('./config')
const routes = require('./Network/routes')
const db = require('./db')
const cors = require('cors');
/* Creamos una instancia de Frameworf Expres */
let app = express()
const path = require("path")
const server = require('http').Server(app);
const websocket = require('socket.io')(server);


// Se agrega import para tener acces al servidor de autenticacion
import appA from '../api/src/app'
// Evita bloqueos
app.use(cors());

// Coneccion a la basde de datos
db(config.DB_URL)
app.use(body_parser.json())
app.use(body_parser.urlencoded({ extended: false }))

/***************************** INICIO SECCION CODIGO PARA MANEJO DE SOCKETS *************************************/
app.use('/', express.static('public'));

app.use((req, res, next) => {
    req.io = websocket;
    next();
  });
  routes(app)
// Codigo que permite atender peticiones  reques / callback 
websocket.on('connection', function (socket) {
    console.log('Nuevo cliente conectado.')
    /*socket.on("messageClient", function(msg) {
      io.emit("messageClient", msg);
    });*/
})
/***************************** FIN SECCION CODIGO PARA MANEJO DE SOCKETS *************************************/
// Configuramos websocket escucha del servidor cuando lleguen las peticiones
server.listen(config.PORT, function () {
    console.log(`La aplicacion esta escuchando en http://localhost:${config.PORT}`);
})
// Se levanta servicio el cual las peticiones seran escuchadas por el puerto 3006 para temas de Autenticacion
appA.listen(3006)
console.log('Server listen on port ', 3006)