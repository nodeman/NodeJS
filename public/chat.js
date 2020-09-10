const socket = io('http://localhost:9090');
const socket2 = io('http://localhost:9090/admin');
const socket3 = io('http://localhost:9090/wiki');

socket.on('connect', () => {
    console.log(socket.id);   
});

socket.on('nsData', (nsData) => {
    console.log(nsData);

    let html = "";
    nsData.forEach((ns) => {
        console.log(ns);
        html += `<div class="namespace" ns="${ns.endpoint}"><img src="${ns.img}"></div>`
    });
    $(".namespaces").html(html);
});


$(".namespaces div")


/*
socket2.on('welcome', (message) => {
    console.log(message);
});

socket.on('messageFromServer', (dataFromServer) => {
    console.log(dataFromServer);
    socket.emit('messageToServer', {data: 'Client Data'});
});

socket.on('messageToClients', (message) => {
    console.log(message);
    $("#messages").append("<li>" + message.text + "</li>");
});

socket.on('ping', () => {
    console.log('Ping was recieved from the Server');
});

socket.on('pong', (latency) => {
    console.log(latency);
    console.log('Pong was sent to the server');
});

$("document").ready(function() {
    $("#message-form").submit(function(e) {
        e.preventDefault();
        console.log("Form submit");

        const newMessage = $("#user-message").val();
        socket.emit("newMessageToServer", {text: newMessage});
    });
});
*/