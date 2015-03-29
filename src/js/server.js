var socket = io('http://' + server);
  
socket.on('destination', function (destination) {
	console.log(window.location.href, destination);
	if (window.location.href !== destination) {
    	window.location = destination;
	}
});