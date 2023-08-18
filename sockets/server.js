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

let usuariosConectados = [];
// let userOnId =  new Array();
// let idsOnUser = new Array();

io.on("connection", socket => {
    console.log("Nueva conexión, ", socket.id);
    
    socket.on("loginForm", data => {
        usuariosConectados.push({usuario: data.usuario, pass: data.pass, id: socket.id});
        console.log(usuariosConectados);
    });

    socket.on("sendMessage", data => {
        console.log('Message: ', data);
        // io.to(data.idUser).emit("showMessage", data);
        io.emit("showMessage", data);
    });

    socket.on("disconnect", () =>{
        console.log("Id Desconectado", socket.id);
    });
});




httpServer.listen(3000);