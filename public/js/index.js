const socket = io();
let data = {
    usuario: '',
    pass: ''
}

$(document).ready(()=>{
    $('#chat').css("display", "none");
});

$('#form').submit(e=>{
    e.preventDefault();
    data.usuario = $("#inputUsuario").val()
    data.pass = $("#inputPassword").val()
    data.usuario && data.pass ? socket.emit("loginForm", data) : '';
    data.usuario && data.pass ? $("#login").css("display", "none") : '';
    $('#chat').removeAttr("style");
});

const sendMessage = () =>{
    const message = $("#inputMessage").val()
    socket.emit("sendMessage", {usuario: data.usuario, message: message});
    $("#inputMessage").val('')
}