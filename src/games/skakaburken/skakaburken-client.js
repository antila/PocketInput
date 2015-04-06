var checkOrientation = function() {
    if(window.innerHeight > window.innerWidth) { 
        $('html').removeClass('landscape').addClass('portrait');
    } else {
        $('html').removeClass('portrait').addClass('landscape');
    }
};

window.addEventListener( 'orientationchange', checkOrientation, false );
window.addEventListener( 'resize', checkOrientation, false );

$(document).ready(function() {
    checkOrientation();

    var imgsrc = $('.soda img').attr("src").replace("1.png", Math.floor((Math.random() * 8) + 1) + ".png");
    $('.soda img').attr("src", imgsrc);

    // Hack to make safari iOS stay awake.
    var stayAwake = setInterval(function () {
        location.href = location.href; //try refreshing
        window.setTimeout(window.stop, 0); //stop it soon after
    }, 20000);


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
    }
});