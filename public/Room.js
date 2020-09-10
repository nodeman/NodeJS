(function ($) {  
    "use strict";   

    var Room = {

        init: function(){

  
            

            console.log("Room.init");
            return this;    
        },

        joinRoom: function(roomName) {
            //console.log(newNumberOfMembers);
            App.nsSocket.emit('joinRoom', roomName, (newNumberOfMembers)=>{
                // we want to update the room member total now that we have joined!
                document.querySelector('.curr-room-num-users').innerHTML = `${newNumberOfMembers} <span class="glyphicon glyphicon-user"></span>`
            })
        }

    };

    window.Room = Room.init();  
}(jQuery));
