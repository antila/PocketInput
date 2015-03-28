var joystick = new VirtualJoystick({
    container : document.getElementById('container'),
    mouseSupport : true,
});

var actionButton = false;

setInterval(function(){
    // joystick.deltaX()
    // joystick.deltaY()
    var direction = 'none';

    if( joystick.right() ){
        direction = 'right';
    }

    if( joystick.left() ){
        direction = 'left';
    }

    if( joystick.up() ){
        direction = 'up';
    }

    if( joystick.down() ){
        direction = 'down';
    }

    socket.emit('input', { 
        key: direction,
        actionButton: actionButton,
        deltaX: joystick.deltaX(),
        deltaY: joystick.deltaY(),
        userId: userId 
    });
}, 1/30 * 1000);

var startActing = function(event) {
    actionButton = true;
};

var stopActing = function(event) {
    actionButton = false;
};

document.getElementById('button').addEventListener('mousedown', startActing);
document.getElementById('button').addEventListener('touchstart', startActing);

document.getElementById('button').addEventListener('mouseup', stopActing);
document.getElementById('button').addEventListener('touchend', stopActing);

$(document).ready(function() {
    $('h1').text(username);
});