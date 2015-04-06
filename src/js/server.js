var socket = io('http://' + server);
  
socket.on('destination', function (destination) {
	if (window.location.href !== destination) {
    	window.location = destination;
	}
});

if (typeof gameId !== 'undefined') {
	socket.emit('destination', gameId);
}