const socket = io();
let data = {
    usuario: '',
    pass: ''
}
let lastUser = ''

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
    message ? socket.emit("sendMessage", {usuario: data.usuario, message: message}) : ''; 
    $("#inputMessage").val('')
}

socket.on("showMessage", data => {
    let message = "<span class=\"chat-messages-message\">"    
    if (lastUser == data.usuario) {
        message += "<p class=\"chat-messages-message-text\">" + data.message + "</p>"
    }else{
        message += "<strong class=\"chat-messages-message-user\">" + data.usuario + " </strong>"
        message += "<p class=\"chat-messages-message-text\">" + data.message + "</p>"
    }
    message += "</span>"
    lastUser = data.usuario
    $("#chat-messages").append(message);
});