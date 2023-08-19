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
let idsUsuarios = [];

io.on("connection", socket => {
    console.log("Nueva conexión, ", socket.id);
    
    socket.on("loginForm", data => {
        usuariosConectados.push({usuario: data.usuario, id: socket.id});
        if(!idsUsuarios[data.usuario]){
            idsUsuarios[data.usuario] = [socket.id];
        }else{
            idsUsuarios[data.usuario].push(socket.id);
        }
    });

    socket.on("sendMessage", data => {
        // io.to(data.idUser).emit("showMessage", data);
        io.emit("showMessage", data);
    });

    socket.on("disconnect", () =>{
        if (usuariosConectados.length > 0) {
            [usuarioDesconectado] = usuariosConectados.filter(conectados => conectados.id == socket.id)
            usuariosConectados = usuariosConectados.filter(conectados => conectados.id != socket.id)
            idsUsuarios[usuarioDesconectado.usuario].map((curr, i) => {
                curr == usuarioDesconectado.id ? idsUsuarios[usuarioDesconectado.usuario].splice(i, 1) : '';
            });
            idsUsuarios[usuarioDesconectado.usuario].length < 1 ? delete idsUsuarios[usuarioDesconectado.usuario] : '';
        }
    });
});

httpServer.listen(3000);