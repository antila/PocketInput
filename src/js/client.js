var userId = localStorage.getItem("userId");
var username = localStorage.getItem("username");
if (userId === null) {
    userId = guid();
    localStorage.setItem("userId", userId);
}

console.log('userId', userId);

var socket = io('http://' + server);
  
socket.on('connect', function (users) {
    socket.emit('setId', userId);

    if (username !== null) {
        socket.emit('setName', { name: username });
        if (typeof startGame !== 'undefined') {
            startGame();
        }
    }
});

socket.on('destination', function (destination) {
    window.location = destination;
});

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}