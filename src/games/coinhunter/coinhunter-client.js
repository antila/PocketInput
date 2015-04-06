var joystick = new VirtualJoystick({
    container : document.getElementById('joystick'),
    mouseSupport : true,
});

var checkOrientation = function() {
    if(window.innerHeight > window.innerWidth) { 
        $('html').removeClass('landscape').addClass('portrait');
    } else {
        $('html').removeClass('portrait').addClass('landscape');
    }
};



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

window.addEventListener( 'orientationchange', checkOrientation, false );
window.addEventListener( 'resize', checkOrientation, false );

document.getElementById('button').addEventListener('mousedown', startActing);
document.getElementById('button').addEventListener('touchstart', startActing);

document.getElementById('button').addEventListener('mouseup', stopActing);
document.getElementById('button').addEventListener('touchend', stopActing);

$(document).ready(function() {
    checkOrientation();
    $('h1').text(username);
});