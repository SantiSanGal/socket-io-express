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

//arrayObject para usuarios conectados
let usuariosConectados = [];

//array de arrays para ids de usuarios con conexiones multiples
let idsUsuarios = [];

io.on("connection", socket => {
    console.log("Nueva conexión, ", socket.id);
    
    socket.on("loginForm", data => {
        //juntamos todos los usuarios conectados
        usuariosConectados.push({usuario: data.usuario, id: socket.id});
        //si no existe el usuario, crea un espacio
        if(!idsUsuarios[data.usuario]){
            idsUsuarios[data.usuario] = [socket.id];
        //si ya existe, pushea el id
        }else{
            idsUsuarios[data.usuario].push(socket.id);
        }

        io.emit("usuariosConectados", usuariosConectados);
    });

    socket.on("sendMessage", data => {
        console.log('data', data);
        if (data.destinatario) {
            if (idsUsuarios[data.destinatario]) {
                for (let i = 0; i < idsUsuarios[data.destinatario].length; i++) {
                    console.log('xd', idsUsuarios[data.destinatario][i]);
                    io.to(idsUsuarios[data.destinatario][i]).emit("showMessage", data);
                }                        
            }
        }else{
            io.emit("showMessage", data);
        }
        // data.destinatario ? io.to().emit("showMessage", data) 
        // : io.emit("showMessage", data);
        // // io.to(data.idUser).emit("showMessage", data);
    });

    socket.on("disconnect", () =>{
        //verifico si hay algún usuario loggeado
        if (usuariosConectados.length > 0) {
            //obtengo el usuario que se desconectó 
            [usuarioDesconectado] = usuariosConectados.filter(conectados => conectados.id == socket.id)
            console.log(usuarioDesconectado);

            if (usuarioDesconectado) {
                //de los usuarios conectados, saco el que se desconectó ahora
                usuariosConectados = usuariosConectados.filter(conectados => conectados.id != socket.id)
                
                //elimino el id desconectado
                // if (idsUsuarios[usuarioDesconectado.usuario]) {
                idsUsuarios[usuarioDesconectado.usuario].map((curr, i) => {
                    curr == usuarioDesconectado.id ? idsUsuarios[usuarioDesconectado.usuario].splice(i, 1) : '';
                });   
                // }
            
                //si ya no hay ids conectados, borro el usuario del array
                idsUsuarios[usuarioDesconectado.usuario].length < 1 ? delete idsUsuarios[usuarioDesconectado.usuario] : '';
            
                io.emit("usuariosConectados", usuariosConectados);
            }
        }
    });
});

httpServer.listen(80);
