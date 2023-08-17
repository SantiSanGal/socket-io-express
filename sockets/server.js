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

let userOnId =  new Array();
let idsOnUser = new Array();

io.on("connection", socket => {
    console.log("Nueva conexión, ", socket.id);
    
    socket.on("loginForm", data => {
        userOnId[socket.id] = data.usuario;
        if (!idsOnUser[data.usuario]) {
            idsOnUser[data.usuario] = [socket.id];
        }else{
            idsOnUser[data.usuario].push(socket.id);
        }
        console.log('userOnId', userOnId);
        console.log('idsOnUser', idsOnUser);
    });

    socket.on("sendMessage", data => {
        console.log('Message: ', data);
        io.to(data.idUser).emit("showMessage", data);
    });    
    
});


httpServer.listen(3000);