var inputStart = function(event) {
    console.log('input start');
    socket.emit('input', { 
        touch: true,
        userId: userId 
    });
};

var inputStop = function(event) {
	console.log('input end');
    socket.emit('input', { 
        touch: false,
        userId: userId 
    });
};

document.getElementById('button').addEventListener('touchstart', inputStart);
document.getElementById('button').addEventListener('mousedown', inputStart);

document.getElementById('button').addEventListener('touchend', inputStop);
document.getElementById('button').addEventListener('mouseup', inputStop);

$(document).ready(function() {
    $('h1').text(username);
});