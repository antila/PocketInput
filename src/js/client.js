var addPlayer;

var userId = localStorage.getItem("userId");
var username = localStorage.getItem("username");
if (userId === null) {
    userId = guid();
    localStorage.setItem("userId", userId);
}

console.log('userId', userId);

var socket = io('http://10.131.6.124');
  
socket.on('connect', function (users) {
    socket.emit('setId', userId);

    if (username !== null) {
        socket.emit('setName', { name: username });
        startGame();
    }
});

socket.on('destination', function (destination) {
    window.location = destination;
});

$('#submit').on('click', function() {
    var name = $('#username').val();
    socket.emit('setName', { name: name });
    localStorage.setItem("username", name);
    username = localStorage.getItem("username");
    startGame();
});

function startGame() {
    $('#join').hide();
    $('h1 span').text(username);
}

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}