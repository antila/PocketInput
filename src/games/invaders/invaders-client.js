var joystick = new VirtualJoystick({
    container : document.getElementById('container'),
    mouseSupport : true,
});

// var sendEvents = false;

// joystick.addEventListener('touchStart', function(){
//     console.log('start');
//     sendEvents = true;
// })
// joystick.addEventListener('touchEnd', function(){
//     sendEvents = false;
// })

var isShooting = false;

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
        isShooting: isShooting,
        deltaX: joystick.deltaX(),
        deltaY: joystick.deltaY(),
        userId: userId 
    });
}, 1/30 * 1000);

document.getElementById('button').addEventListener('touchstart', function(event) {
    isShooting = true;
});

document.getElementById('button').addEventListener('touchend', function(event) {
    isShooting = false;
});

$(document).ready(function() {
    $('h1').text(username);
});