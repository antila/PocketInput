$(document).ready(function() {
    $('h1').text(username);
    
    //create a new instance of shake.js.
    var myShakeEvent = new Shake({
        threshold: 1,
        timeout: 50
    });

    var clientShake = {
        x: 0,
        y: 0,
        z: 0,
        deltaX: 0,
        deltaY: 0,
        deltaZ: 0,
        motion: 0
    }

    // start listening to device motion
    myShakeEvent.start();

    // register a shake event
    window.addEventListener('shake', shakeEventDidOccur, false);
    
    //shake event callback
    function shakeEventDidOccur (shake) {

         $('.shake').text(myShakeEvent.lastX);

        //put your own code here etc.
        clientShake.deltaX = Math.abs(clientShake.x - myShakeEvent.lastX);
        clientShake.deltaY = Math.abs(clientShake.y - myShakeEvent.lastY);
        clientShake.deltaZ = Math.abs(clientShake.z - myShakeEvent.lastZ);

        clientShake.motion = Math.sqrt((clientShake.deltaX * clientShake.deltaX) + (clientShake.deltaY * clientShake.deltaY) + (clientShake.deltaZ * clientShake.deltaZ));

        clientShake.x = myShakeEvent.lastX;
        clientShake.y = myShakeEvent.lastY;
        clientShake.z = myShakeEvent.lastZ;

        socket.emit('input', { 
            shake: clientShake,
            userId: userId 
        });

        $('.shake').text("shaked:" + clientShake.motion.toFixed(2));
    }
});