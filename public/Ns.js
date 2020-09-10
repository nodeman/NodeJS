(function ($) {  
    "use strict";   

    var Ns = {

        init: function() {
            this.eventBind();
            console.log("Ns.init");
            return this;    
        },

        eventBind: function() {
            $(".room-list").on('click', 'li', this.roomClick);
        },
        
        roomClick: function() {
            let roomName = $(this).text();
            $(".curr-room-text").text(roomName);
            console.log(roomName);
            Room.joinRoom(roomName);
        },

        join: function(endpoint) {
            console.log("========Namespace Join=========");
            console.log(endpoint);
            console.log("========Namespace Join=========");

            if(App.nsSocket) {
                App.nsSocket.close();
                $("#user-input").off();
            }

            App.nsSocket = io(`http://localhost:9090${endpoint}`);

            App.nsSocket.on('nsRoomLoad', (nsRooms) => {
                console.log(nsRooms);
                var html = "";
                nsRooms.forEach((room) => {
                    let lock = room.privateRoom == true ? 'lock':'globe'; 
                    html += `<li><span class="glyphicon glyphicon-${lock}"></span>${room.roomTitle}</li>`;
                });
                $(".room-list").html(html);
            });

            App.nsSocket.on('updateMembers',(numMembers)=>{
                document.querySelector('.curr-room-num-users').innerHTML = `${numMembers} <span class="glyphicon glyphicon-user"></span>`
                document.querySelector('.curr-room-text').innerText = `${roomName}`
            })

            
            App.nsSocket.on('historyCatchUp',(history)=>{
                // console.log(history)
                const messagesUl = document.querySelector('#messages');
                messagesUl.innerHTML = "";
                history.forEach((msg)=>{
                    const newMsg = buildHTML(msg)
                    messagesUl.innerHTML += newMsg;
                });
                messagesUl.scrollTo(0,messagesUl.scrollHeight);
            });
            

        }

    };

    window.Ns = Ns.init();  
}(jQuery));
