const socket = io();

const colors = ["#fc9671", "#ffd26c", "#53a6fd", "#4858ff", "#f15c5a", "#23a03b", "#AA00FF"]

const randomColor = () => {
    const color = colors[Math.floor(Math.random() * colors.length)];
    return color
};

let data = {
    usuario: '',
    pass: '',
};

let lastUser = '';
let userSelectedForDm = '';
let chatAbierto = '';

$(document).ready(()=>{
    $('#chat').css("display", "none");
    $('#chat-privado').css("display", "none");
});

$('#form').submit(e=>{
    e.preventDefault();
    data.usuario = $("#inputUsuario").val()
    data.pass = $("#inputPassword").val()
    data.usuario && data.pass ? socket.emit("loginForm", data) : '';
    data.usuario && data.pass ? $("#login").css("display", "none") : '';
    $('#chat').removeAttr("style");
    $('#username').html(`<b>${data.usuario}</b>`)
});

const sendMessage = () =>{
    const message = $("#inputMessage").val()
    message ? socket.emit("sendMessage", {usuario: data.usuario, message: message}) : '';
    $("#inputMessage").val('')
}

const sendDM = () => {
    const message = $('#inputDM').val();
    console.log('message', message);
    message ? socket.emit("sendMessage", {usuario: data.usuario, destinatario: userSelectedForDm,message: message}) : '';
    $("#inputDM").val('')
}

socket.on("showMessage", data => {
    chatAbierto = $('#username-privado').innerHTML();
    console.log('chatAbierto', chatAbierto);
    if (data.destinatario) {
        if (data.destinatario == chatAbierto) {
            // let message = "<span class=\"chat-messages-message\">"    
            // if (lastUser == data.usuario) {
            //     message += "<p class=\"chat-messages-message-text\">" + data.message + "</p>"
            // }else{
            //     message += "<strong id=\"chat-messages-message-user-"+ data.usuario +"\" class=\"chat-messages-message-user chat-messages-message-user-"+ data.usuario +"\">" + data.usuario + " </strong>"
            //     message += "<p class=\"chat-messages-message-text\">" + data.message + "</p>"
            // }
            // message += "</span>"
            // lastUser = data.usuario
            // $("#chat-messages").append(message);
            // $(".chat-messages-message-user-"+ data.usuario).css("color", randomColor());
        }
    }else{
        let message = "<span class=\"chat-messages-message\">"    
        if (lastUser == data.usuario) {
            message += "<p class=\"chat-messages-message-text\">" + data.message + "</p>"
        }else{
            message += "<strong id=\"chat-messages-message-user-"+ data.usuario +"\" class=\"chat-messages-message-user chat-messages-message-user-"+ data.usuario +"\">" + data.usuario + " </strong>"
            message += "<p class=\"chat-messages-message-text\">" + data.message + "</p>"
        }
        message += "</span>"
        lastUser = data.usuario
        $("#chat-messages").append(message);
        $(".chat-messages-message-user-"+ data.usuario).css("color", randomColor());
    }
});

socket.on("usuariosConectados", usuariosConectados => {
    $("#sidebar-users").html('')
    let usuarios = ''
    usuariosConectados.map(usuario => {
        if (usuario.usuario != data.usuario) {
            usuarios += `<div id="usuario-container-${usuario.usuario}" class="usuario-container" onclick="handleUsuarioClick('${usuario.usuario}')">`
            usuarios += `   <span class="en-linea"><b> ${usuario.usuario} </b></span>`
            usuarios += '   <span class="en-linea"><div class="mini-icon"></div> En Linea</span>'
            usuarios += '</div>'
        }
    });
    $("#sidebar-users").append(usuarios)
});

const handleUsuarioClick = (usuario) => {
    console.log(usuario);
    userSelectedForDm = usuario;
    $('#chat').css("display", "none");
    $('#chat-privado').removeAttr("style");
    $('#username-privado').html(`<b>${userSelectedForDm}</b>`);   
}

const goBack = () => {
    $('#chat-privado').css("display", "none");
    $('#chat').removeAttr("style");
};


