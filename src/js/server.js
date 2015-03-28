var socket = io('http://' + server);
  
socket.on('destination', function (destination) {
    window.location = destination;
});