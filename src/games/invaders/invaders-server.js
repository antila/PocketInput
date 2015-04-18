(function() {
  'use strict';

function Game() {

}

Game.prototype = {
    preload: function() {
        var game = this;
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.scale.setScreenSize();

        game.load.image('bullet', '/games/invaders/assets/bullet.png');
        game.load.image('enemyBullet', '/games/invaders/assets/enemy-bullet.png');
        game.load.spritesheet('invader', '/games/invaders/assets/invader32x32x4.png', 32, 32);
        game.load.image('ship', '/games/invaders/assets/player.png');
        game.load.spritesheet('kaboom', '/games/invaders/assets/explode.png', 128, 128);
        game.load.image('starfield', '/games/invaders/assets/starfield.png');
        game.load.image('background', '/games/invaders/assets/background2.png');
    },

    create: function () {
        var game = this;

        this.texts = {};
        this.users = [];
        this.bulletTime = 0;
        this.score = 0;
        this.scoreString = '';
        this.firingTimer = 0;
        this.livingEnemies = [];
        this.players = [];

        socket.on('input', function (input) {
            // console.log(input);
            if (typeof game.users[input.userId] === 'undefined') {
                return;
            }

            var player = game.users[input.userId].player;

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

            player.shoot = input.isShooting;
        });

        socket.on('users', function (updateUsers) {
            // Add new users
            if (typeof this.users === 'undefined') {
                this.users = [];
            }

            updateUsers.forEach(function(user, index) {
                if (typeof game.users[user.userId] === 'undefined') {
                    console.log('create', user.userId, user, game);
                    game.users[user.userId] = {};
                    game.users[user.userId].player = game.createPlayer(user.userId, index);
                    game.users[user.userId].killCount = 0;
                    var style = { font: "12px Arial", fill: "#ff0044", align: "center" };

                    var t = game.game.add.text(game.world.centerX-300, 0, user.name, style);

                    game.texts[user.userId] = t;
                }
            });

            // Remove users no longer connected
            this.users.forEach(function(user) {
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
        });

        socket.emit('ready');

        game.stage.scaleMode = Phaser.ScaleManager.SHOW_ALL;

        game.physics.startSystem(Phaser.Physics.ARCADE);

        game.stage.disableVisibilityChange = true;

        //  The scrolling starfield background
        this.starfield = game.add.tileSprite(0, 0, 1024, 576, 'starfield');

        //  Our bullet group
        this.bullets = game.add.group();
        this.bullets.enableBody = true;
        this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
        this.bullets.createMultiple(30, 'bullet');
        this.bullets.setAll('anchor.x', 0.5);
        this.bullets.setAll('anchor.y', 1);
        this.bullets.setAll('outOfBoundsKill', true);
        this.bullets.setAll('checkWorldBounds', true);

        // The enemy's bullets
        this.enemyBullets = game.add.group();
        this.enemyBullets.enableBody = true;
        this.enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
        this.enemyBullets.createMultiple(30, 'enemyBullet');
        this.enemyBullets.setAll('anchor.x', 0.5);
        this.enemyBullets.setAll('anchor.y', 1);
        this.enemyBullets.setAll('outOfBoundsKill', true);
        this.enemyBullets.setAll('checkWorldBounds', true);

        //  The baddies!
        this.aliens = game.add.group();
        this.aliens.enableBody = true;
        this.aliens.physicsBodyType = Phaser.Physics.ARCADE;

        this.createAliens();

        //  The score
        this.scoreString = 'Score : ';
        this.scoreText = game.add.text(10, 10, this.scoreString + this.score, { font: '34px Arial', fill: '#fff' });

        //  Lives
        // lives = game.add.group();
        // game.add.text(game.world.width - 100, 10, 'Lives : ', { font: '34px Arial', fill: '#fff' });

        //  Text
        this.stateText = game.add.text(game.world.centerX, game.world.centerY,' ', { font: '84px Arial', fill: '#fff' });
        this.stateText.anchor.setTo(0.5, 0.5);
        this.stateText.visible = false;

        // for (var i = 0; i < 3; i++)
        // {
        //     var ship = lives.create(game.world.width - 100 + (30 * i), 60, 'ship');
        //     ship.anchor.setTo(0.5, 0.5);
        //     ship.angle = 90;
        //     ship.alpha = 0.4;
        // }

        //  An explosion pool
        this.explosions = this.game.add.group();
        this.explosions.createMultiple(30, 'kaboom');
        this.explosions.forEach(this.setupInvader, this);
    },

    update: function () {
        var game = this;

        stats.begin();

        var movementSpeed = 200;

        //  Scroll the background
        this.starfield.tilePosition.y += 2;

        //  Reset the player, then check for movement keys
        this.players.forEach(function(player) {
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
                game.fireBullet(player);
            }

            game.physics.arcade.overlap(game.enemyBullets, player, game.enemyHitsPlayer, null, game);
            if (typeof game.texts[player.userId] !== 'undefined') {
                var text =  game.texts[player.userId];

                text.x = player.x - text.width/2;
                text.y = player.y + 10;
            }
        });

        if (game.time.now > this.firingTimer && this.players.length > 0) {
            this.enemyFires();
        }

        //  Run collision
        game.physics.arcade.overlap(this.bullets, this.aliens, this.collisionHandler, null, this);
    },

    // render: function() {
        // var that = this;
        // Object.keys(this.players).forEach(function(userId) {
        //     var player = that.players[userId].player;

        //     that.game.debug.bodyInfo(player, 32, 32);
        //     that.game.debug.body(player);
        // });
    // },

    createPlayer: function(userId, index) {
        //  The hero!

        var widthPerPlayer = this.game.world.width / (this.players.length + 1);

        var posX = index * widthPerPlayer;
        var player = this.game.add.sprite(posX, 500, 'ship');
        player.anchor.setTo(0.5, 0.5);
        this.game.physics.enable(player, Phaser.Physics.ARCADE);

        player.body.collideWorldBounds=true;
        player.body.bounce.setTo(0.9, 0.9);
        player.userId = userId;

        this.players.push(player);

        return player;
    },

    createAliens: function() {
        var game = this;

        for (var y = 0; y < 4; y++)
        {
            for (var x = 0; x < 10; x++)
            {
                var alien = this.aliens.create(x * 48, y * 50, 'invader');
                alien.anchor.setTo(0.5, 0.5);
                alien.animations.add('fly', [ 0, 1, 2, 3 ], 20, true);
                alien.play('fly');
                alien.body.moves = false;
            }
        }

        this.aliens.x = 100;
        this.aliens.y = 50;

        //  All this does is basically start the invaders moving. Notice we're moving the Group they belong to, rather than the invaders directly.
        var tween = game.add.tween(this.aliens).to( { x: 400 }, 3000, Phaser.Easing.Linear.None, true, 0, 1000, true);

        //  When the tween loops it calls descend
        tween.onLoop.add(this.descend, this);
    },

    setupInvader: function(invader) {
        invader.anchor.x = 0.5;
        invader.anchor.y = 0.5;
        invader.animations.add('kaboom');
    },

    descend: function() {
        this.aliens.y += 10;
    },

    collisionHandler: function(bullet, alien) {
        //  When a bullet hits an alien we kill them both
        this.users[bullet.player.userId].killCount++;

        bullet.kill();
        alien.kill();

        //  Increase the score
        this.score += 20;
        this.scoreText.text = this.scoreString + this.score;

        //  And create an explosion :)
        var explosion = this.explosions.getFirstExists(false);
        explosion.reset(alien.body.x, alien.body.y);
        explosion.play('kaboom', 30, false, true);

        if (this.aliens.countLiving() == 0)
        {
            this.score += 1000;
            this.scoreText.text = scoreString + score;

            this.enemyBullets.callAll('kill',this);
            this.stateText.text = " You Won, \n Good job";
            this.stateText.visible = true;

            this.endGame();
        }

    },

    endGame: function() {
        var that = this;
        var highscore = [];

        Object.keys(this.users).forEach(function(userId) {
            var user = that.users[userId];
            console.log('user', user, userId);
            highscore.push({
                userId: userId,
                score: user.killCount
            });
        });

        setTimeout(function() {
            socket.emit('gameover', highscore);
        }, 3000);
    },

    enemyHitsPlayer: function(player, bullet) {

        bullet.kill();

        // live = lives.getFirstAlive();

        // if (live)
        // {
        //     live.kill();
        // }

        //  And create an explosion :)
        console.log('äsetupInvader', this.explosions);
        var explosion = this.explosions.getFirstExists(false);
        explosion.reset(player.body.x, player.body.y);
        explosion.play('kaboom', 30, false, true);

        // When the player dies
        // if (lives.countLiving() < 1)
        // {
            player.kill();
            this.texts[player.userId].kill();

            var index = this.players.indexOf(player);
            this.players.splice(index, 1);

            // enemyBullets.callAll('kill');

        if (this.players.length === 0) {
            this.stateText.text=" GAME OVER";
            this.stateText.visible = true;

            this.endGame();
            //the "click to restart" handler
            // game.input.onTap.addOnce(restart,this);
        }

    },

    enemyFires: function() {
        var game = this;

        //  Grab the first bullet we can from the pool
        var enemyBullet = this.enemyBullets.getFirstExists(false);

        this.livingEnemies = [];

        this.aliens.forEachAlive(function(alien){
            // put every living enemy in an array
            game.livingEnemies.push(alien);
        });

        if (enemyBullet && this.livingEnemies.length > 0)
        {
            var random=game.rnd.integerInRange(0, game.livingEnemies.length-1);

            // randomly select one of them
            var shooter = game.livingEnemies[random];
            // And fire the bullet from this enemy
            enemyBullet.reset(shooter.body.x, shooter.body.y);

            var randomIndex = Math.floor(game.players.length * Math.random());
            var randomPlayer = game.players[randomIndex];

            if (typeof randomPlayer !== 'undefined') {
            // players.forEach(function(player) {
                game.physics.arcade.moveToObject(enemyBullet, randomPlayer, 120);
            } else {
            }
            // });
            this.firingTimer = game.time.now + 200;
        }

    },

    fireBullet: function(player) {
        var game = this;

        //  To avoid them being allowed to fire too fast we set a time limit
        if (game.time.now > player.bulletTime || typeof player.bulletTime === 'undefined')
        {
            //  Grab the first bullet we can from the pool
            var bullet = this.bullets.getFirstExists(false);
            bullet.player = player;

            if (bullet)
            {
                //  And fire it
                bullet.reset(player.x, player.y + 8);
                bullet.body.velocity.y = -400;
                player.bulletTime = game.time.now + 900;
            }
        }
    },

    resetBullet: function(bullet) {
        //  Called if the bullet goes out of the screen
        bullet.kill();
    },

    restart: function() {
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
};

window['phaser'] = window['phaser'] || {};
window['phaser'].Game = Game;
window['gameId'] = 'invaders';

}());
