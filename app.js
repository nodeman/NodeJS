const express = require('express');
const socketio = require('socket.io');
let namespaces = require('./data/namespaces');

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
    console.log(socket.handshake.query);
    console.log('Main Socket Connect : ' + socket.id);

    //Chat 네임스페이스 
    let nsData = namespaces.map((ns) => { return {img: ns.img, endpoint: ns.endpoint} });
    //console.log(nsData);
    socket.emit('nsData', nsData);


    /*
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
    */
})

/*
io.of('/admin').on('connection', (socket) => {
    console.log("Someone connected to the admin");
    io.of('/admin').emit('welcome', "Welcome message!!");
});
*/

namespaces.forEach((ns) => {
    io.of(ns.endpoint).on('connection', (nsSocket) => {
        console.log(`========Namespace ${ns.endpoint} Join=======`);
        console.log(`socketId : ${nsSocket.id}`);
        console.log(`====================================\n`);
        
        //Room 목록전송
        nsSocket.emit('nsRoomLoad', ns.rooms);

        
        nsSocket.on('joinRoom',(roomToJoin, numberOfUsersCallback)=>{

            console.log(nsSocket.rooms);
            //{ '/mozilla#VDv1KeCvexojrB2fAAAC': '/mozilla#VDv1KeCvexojrB2fAAAC' }

            const roomToLeave = Object.keys(nsSocket.rooms)[0];
            
            console.log(ns);
            
            console.log(roomToLeave);
            ///mozilla#VDv1KeCvexojrB2fAAAC

            console.log("***********************************");
            nsSocket.leave(roomToLeave);
            console.log(nsSocket.rooms);

            updateUsersInRoom(ns, roomToLeave)
            nsSocket.join(roomToJoin)
             io.of('/wiki').in(roomToJoin).clients((error, clients)=>{
                 console.log(clients.length)
                 numberOfUsersCallback(clients.length);
            });
 
            const nsRoom = ns.rooms.find((room)=>{
                return room.roomTitle === roomToJoin;
            })
            nsSocket.emit('historyCatchUp', nsRoom.history)
            updateUsersInRoom(ns, roomToJoin);
            
            
        });
    });
});

function updateUsersInRoom(ns, roomToJoin){
    // Send back the number of users in this room to ALL sockets connected to this room
    io.of(ns.endpoint).in(roomToJoin).clients((error,clients)=>{
        // console.log(`There are ${clients.length} in this room`);
        io.of(ns.endpoint).in(roomToJoin).emit('updateMembers',clients.length)
    });
}