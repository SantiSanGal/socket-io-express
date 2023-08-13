const socket = io();

const colors = ["#fc9671", "#ffd26c", "#53a6fd", "#4858ff", "#f15c5a", "#23a03b", "#AA00FF"]

const randomColor = () => {
    const color = colors[Math.floor(Math.random() * colors.length)];
    return color
};

let data = {
    usuario: '',
    pass: '',
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
        message += "<strong id=\"chat-messages-message-user-"+ data.usuario +"\" class=\"chat-messages-message-user chat-messages-message-user-"+ data.usuario +"\">" + data.usuario + " </strong>"
        message += "<p class=\"chat-messages-message-text\">" + data.message + "</p>"
    }
    message += "</span>"
    lastUser = data.usuario
    $("#chat-messages").append(message);
    console.log(data.color, typeof(data.color));
    $(".chat-messages-message-user-"+ data.usuario).css("color", randomColor());
});


