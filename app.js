const express = require('express');
const socketio = require('socket.io');
const app = express();

app.use(express.static(__dirname + '/public'));
const expressServer = app.listen(9090);

const io = socketio(expressServer, {
    path: '/socket.io',
    serveClient: true,
    pingInterval: 25000,
    pingTimeout: 10000
});

io.on('connection', (socket) => {
    console.log('Connect : ' + socket.id);

    socket.emit('messageFromServer', {data: 'socketio Server'});
    
    socket.on('messageToServer', (dataFromClient) => {
        console.log(dataFromClient);
    });

    socket.on('error', (error) => {
        console.log('Error : ' + error);
    });

    socket.on('disconnecting', (reason) => {
        console.log('Disconnect : ' + socket.id);
    });

    socket.on('newMessageToServer', (message) => {
        console.log(message);
        //io.of('/').emit('messageToClients', {text: message.text});
        io.emit('messageToClients', {text: message.text});
    });

    io.of('/admin').emit('welcome', 'Welcome admin emit');

})

io.of('/admin').on('connection', (socket) => {
    console.log("Someone connected to the admin");
    io.of('/admin').emit('welcome', "Welcome message!!");
});