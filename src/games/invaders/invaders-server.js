

/* Game --------------------------------------------------------------------- */
var game = new Phaser.Game(1024, 576, Phaser.AUTO, 'phaser-game', { preload: preload, create: create, update: update, render: render });

function preload() {
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.setScreenSize();

    game.load.image('bullet', '/games/invaders/assets/bullet.png');
    game.load.image('enemyBullet', '/games/invaders/assets/enemy-bullet.png');
    game.load.spritesheet('invader', '/games/invaders/assets/invader32x32x4.png', 32, 32);
    game.load.image('ship', '/games/invaders/assets/player.png');
    game.load.spritesheet('kaboom', '/games/invaders/assets/explode.png', 128, 128);
    game.load.image('starfield', '/games/invaders/assets/starfield.png');
    game.load.image('background', '/games/invaders/assets/background2.png');
}

var texts = {};
var users = [];
var aliens;
var bullets;
var bulletTime = 0;
var explosions;
var starfield;
var score = 0;
var scoreString = '';
var scoreText;
// var lives;
var enemyBullet;
var firingTimer = 0;
var stateText;
var livingEnemies = [];

var players = [];

function createPlayer(userId) {
    //  The hero!
    var posX = (players.length + 1) * 100;
    var player = game.add.sprite(posX, 500, 'ship');
    player.anchor.setTo(0.5, 0.5);
    game.physics.enable(player, Phaser.Physics.ARCADE);

    player.body.collideWorldBounds=true;
    player.body.bounce.setTo(0.9, 0.9);
    player.userId = userId;

    players.push(player);

    return player;
}

function create() {
    socket.on('input', function (input) {
        receiveInput(input);
    });
    
    socket.on('users', function (updateUsers) {
        updatePlayers(updateUsers);
    });

    game.stage.scaleMode = Phaser.ScaleManager.SHOW_ALL;

    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.stage.disableVisibilityChange = true;

    //  The scrolling starfield background
    starfield = game.add.tileSprite(0, 0, 1024, 576, 'starfield');

    //  Our bullet group
    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;
    bullets.createMultiple(30, 'bullet');
    bullets.setAll('anchor.x', 0.5);
    bullets.setAll('anchor.y', 1);
    bullets.setAll('outOfBoundsKill', true);
    bullets.setAll('checkWorldBounds', true);

    // The enemy's bullets
    enemyBullets = game.add.group();
    enemyBullets.enableBody = true;
    enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
    enemyBullets.createMultiple(30, 'enemyBullet');
    enemyBullets.setAll('anchor.x', 0.5);
    enemyBullets.setAll('anchor.y', 1);
    enemyBullets.setAll('outOfBoundsKill', true);
    enemyBullets.setAll('checkWorldBounds', true);

    //  The baddies!
    aliens = game.add.group();
    aliens.enableBody = true;
    aliens.physicsBodyType = Phaser.Physics.ARCADE;

    createAliens();

    //  The score
    scoreString = 'Score : ';
    scoreText = game.add.text(10, 10, scoreString + score, { font: '34px Arial', fill: '#fff' });

    //  Lives
    // lives = game.add.group();
    // game.add.text(game.world.width - 100, 10, 'Lives : ', { font: '34px Arial', fill: '#fff' });

    //  Text
    stateText = game.add.text(game.world.centerX,game.world.centerY,' ', { font: '84px Arial', fill: '#fff' });
    stateText.anchor.setTo(0.5, 0.5);
    stateText.visible = false;

    // for (var i = 0; i < 3; i++) 
    // {
    //     var ship = lives.create(game.world.width - 100 + (30 * i), 60, 'ship');
    //     ship.anchor.setTo(0.5, 0.5);
    //     ship.angle = 90;
    //     ship.alpha = 0.4;
    // }

    //  An explosion pool
    explosions = game.add.group();
    explosions.createMultiple(30, 'kaboom');
    explosions.forEach(setupInvader, this);
}

function createAliens () {
    for (var y = 0; y < 4; y++)
    {
        for (var x = 0; x < 10; x++)
        {
            var alien = aliens.create(x * 48, y * 50, 'invader');
            alien.anchor.setTo(0.5, 0.5);
            alien.animations.add('fly', [ 0, 1, 2, 3 ], 20, true);
            alien.play('fly');
            alien.body.moves = false;
        }
    }

    aliens.x = 100;
    aliens.y = 50;

    //  All this does is basically start the invaders moving. Notice we're moving the Group they belong to, rather than the invaders directly.
    var tween = game.add.tween(aliens).to( { x: 400 }, 3000, Phaser.Easing.Linear.None, true, 0, 1000, true);

    //  When the tween loops it calls descend
    tween.onLoop.add(descend, this);
}

function setupInvader (invader) {
    invader.anchor.x = 0.5;
    invader.anchor.y = 0.5;
    invader.animations.add('kaboom');
}

function descend() {
    aliens.y += 10;
}

function update() {
    var movementSpeed = 200;

    //  Scroll the background
    starfield.tilePosition.y += 2;

    //  Reset the player, then check for movement keys
    players.forEach(function(player) {
        player.body.velocity.setTo(0, 0);

        // if (player.moveLeft === true) {
            player.body.velocity.x = player.inputDeltaX * movementSpeed;
            player.body.velocity.y = player.inputDeltaY * movementSpeed;
        // }
        // else if (player.moveRight === true) {
        //     player.body.velocity.x = player.inputDeltaX;
        // }

        if (player.y < 400) {
            player.y = 400;
        }

        //  Firing?
        if (player.shoot)
        {
            fireBullet(player);
        }

        game.physics.arcade.overlap(enemyBullets, player, enemyHitsPlayer, null, this);
        if (typeof texts[player.userId] !== 'undefined') {
            var text =  texts[player.userId];

            text.x = player.x - text.width/2;
            text.y = player.y + 10;
        }
    });

    if (game.time.now > firingTimer && players.length > 0) {
        enemyFires();
    }

    //  Run collision
    game.physics.arcade.overlap(bullets, aliens, collisionHandler, null, this);
}

function render() {

    // for (var i = 0; i < aliens.length; i++)
    // {
    //     game.debug.body(aliens.children[i]);
    // }

}

function collisionHandler (bullet, alien) {
    //  When a bullet hits an alien we kill them both
    users[bullet.player.userId].killCount++;

    bullet.kill();
    alien.kill();

    //  Increase the score
    score += 20;
    scoreText.text = scoreString + score;

    //  And create an explosion :)
    var explosion = explosions.getFirstExists(false);
    explosion.reset(alien.body.x, alien.body.y);
    explosion.play('kaboom', 30, false, true);

    if (aliens.countLiving() == 0)
    {
        score += 1000;
        scoreText.text = scoreString + score;

        enemyBullets.callAll('kill',this);
        stateText.text = " You Won, \n Good job";
        stateText.visible = true;

        endGame();
    }

}

function endGame() {
    console.log('users', users, users.length);
    var highscore = [];

    Object.keys(users).forEach(function(userId) {
        var user = users[userId];
        console.log('user', user, userId);
        highscore.push({
            userId: userId,
            score: user.killCount
        });
    });

    setTimeout(function() {
        socket.emit('gameover', highscore);
    }, 3000); 
}

function enemyHitsPlayer (player, bullet) {
    
    bullet.kill();

    // live = lives.getFirstAlive();

    // if (live)
    // {
    //     live.kill();
    // }

    //  And create an explosion :)
    var explosion = explosions.getFirstExists(false);
    explosion.reset(player.body.x, player.body.y);
    explosion.play('kaboom', 30, false, true);

    // When the player dies
    // if (lives.countLiving() < 1)
    // {
        player.kill();
        texts[player.userId].kill();

        var index = players.indexOf(player);
        players.splice(index, 1);

        // enemyBullets.callAll('kill');

    if (players.length === 0) {
        stateText.text=" GAME OVER \n Restarting";
        stateText.visible = true;

        endGame();
        //the "click to restart" handler
        // game.input.onTap.addOnce(restart,this);
    }

}

function enemyFires () {

    //  Grab the first bullet we can from the pool
    enemyBullet = enemyBullets.getFirstExists(false);

    livingEnemies.length=0;

    aliens.forEachAlive(function(alien){
        // put every living enemy in an array
        livingEnemies.push(alien);
    });

    if (enemyBullet && livingEnemies.length > 0)
    {
        
        var random=game.rnd.integerInRange(0,livingEnemies.length-1);

        // randomly select one of them
        var shooter=livingEnemies[random];
        // And fire the bullet from this enemy
        enemyBullet.reset(shooter.body.x, shooter.body.y);

        var randomIndex = Math.floor(players.length * Math.random());
        var randomPlayer = players[randomIndex];

        if (typeof randomPlayer !== 'undefined') {
        // players.forEach(function(player) {
            game.physics.arcade.moveToObject(enemyBullet, randomPlayer, 120);
        } else {
        }
        // });
        firingTimer = game.time.now + 200;
    }

}

function fireBullet (player) {
    //  To avoid them being allowed to fire too fast we set a time limit
    if (game.time.now > player.bulletTime || typeof player.bulletTime === 'undefined')
    {
        //  Grab the first bullet we can from the pool
        bullet = bullets.getFirstExists(false);
        bullet.player = player;

        if (bullet)
        {
            //  And fire it
            bullet.reset(player.x, player.y + 8);
            bullet.body.velocity.y = -400;
            player.bulletTime = game.time.now + 200;
        }
    }
}

function resetBullet (bullet) {
    //  Called if the bullet goes out of the screen
    bullet.kill();
}

function restart () {
    //resets the life count
    // lives.callAll('revive');
    //  And brings the aliens back from the dead :)
    aliens.removeAll();
    createAliens();

    //revives the player
    players.forEach(function(player) {
        player.revive();
    });
    //hides the text
    stateText.visible = false;
}

/* PocketInput communication ------------------------------------------------ */

/* Player have joined or left the game */
updatePlayers = function updatePlayers(newUsers) {
    // Add new users
    newUsers.forEach(function(user) {
        if (typeof users[user.userId] === 'undefined') {
            console.log('create', user.userId);
            users[user.userId] = {};
            users[user.userId].player = createPlayer(user.userId);
            users[user.userId].killCount = 0; 
            var style = { font: "12px Arial", fill: "#ff0044", align: "center" };

            var t = game.add.text(game.world.centerX-300, 0, user.name, style);

            texts[user.userId] = t;
        }
    });

    // Remove users no longer connected
    users.forEach(function(user) {
        var userExists = false;
        newUsers.forEach(function(newUser) {
            if (newUser.userId === user.userId) {
                userExists = true;
            }
        });

        if (userExists === false) {
            console.log('destroy', user.userId);
            user.player.kill();
        }
    });
}

/* Received input from player */
receiveInput = function receiveInput(input) {
    // console.log(input);

    var player = users[input.userId].player;
    
    player.inputDeltaX = input.deltaX;
    player.inputDeltaY = input.deltaY;

    if (player.inputDeltaY > 100) {
        player.inputDeltaY = 100;
    }
    if (player.inputDeltaY < -100) {
        player.inputDeltaY = -100;
    }
    if (player.inputDeltaX > 100) {
        player.inputDeltaX = 100;
    }
    if (player.inputDeltaX < -100) {
        player.inputDeltaX = -100;
    }
    player.inputDeltaX = player.inputDeltaX / 100;
    player.inputDeltaY = player.inputDeltaY / 100;

    // player.moveLeft = false;
    // player.moveRight = false;
    // player.moveUp = false;
    // player.moveDown = false;
    player.shoot = input.isShooting;
    
    // if(input.key === 'left') {
    //     player.moveLeft = true;
    // }
    // else if(input.key === 'right') {
    //     player.moveRight = true;
    // }
    // else if(input.key === 'up') {
    //     player.moveUp = true;
    // }
    // else if(input.key === 'down') {
    //     player.moveDown = true;
    // }
    // if(input.key === 'shoot') {
    //     player.shoot = true;
    // }
}