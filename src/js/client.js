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
        if (typeof playerJoined !== 'undefined') {
            playerJoined();
        }
    } else {
        if (typeof joinForm !== 'undefined') {
            joinForm();
        }    
    }
});

socket.on('destination', function (destination) {
    console.log(window.location.href, destination);
    if (window.location.href !== destination) {
        window.location = destination;
    }
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

function addButtonClass() {
    $(this).addClass('active');
}

function removeButtonClass() {
    $(this).removeClass('active');
}

$('.button').on('mousedown', addButtonClass);
$('.button').on('touchstart', addButtonClass);
$('.button').on('mouseup', removeButtonClass);
$('.button').on('touchend', removeButtonClass);