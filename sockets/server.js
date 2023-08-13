//npm i express
//npm i socket.io
//npm i nodemon -D //? Cuando hago un cambio en el archivo, se ve reflejado 
//!cambiar en scripts del package.json nodemon sockets/server.js
// * npm start

const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();

app.use(express.static('public'))

const httpServer = createServer(app);
const io = new Server(httpServer, {});

io.on("connection", socket => {
    console.log("Nueva conexión, ", socket.id);
    socket.on("datos_usuario", datos => {
        console.log(datos.name);
        socket.emit("alert", {"name": datos.name});
    });
    
});

httpServer.listen(3000);