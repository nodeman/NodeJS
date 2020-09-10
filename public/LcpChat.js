(function ($) {  
    "use strict";   

    var LcpChat = {

        init: function(){

            const username = prompt("What is your username?")

            const socket = io('http://localhost:9090', {query: {username}});
  
            socket.on('connect', () => {
                console.log(socket.id);   
            });
            
            socket.on('nsData', (nsData) => {
                let html = "";
                nsData.forEach((ns) => {
                    //console.log(ns);
                    html += `<div class="namespace" ns="${ns.endpoint}"><img src="${ns.img}"></div>`
                });
                $(".namespaces").html(html);
                Ns.join('/wiki');
            });

            this.eventBind();
            return this;    
        },

        eventBind: function() {
            $(".namespaces").on('click', '.namespace', this.namespageClick);
            
        },

        namespageClick: function() {
            let ns = $(this).attr("ns");
            Ns.join(ns);
        }

    };

    window.LcpChat = LcpChat.init();  
}(jQuery));
