(function() {
  'use strict';

function Game() {

}

Game.prototype = {
    players: [],
    phaser: null,
    bg: null,
    map: null,
    tileset: null,
    layer: null,
    coins: null,
    player: null,
    cursors: null,
    actionButton: null,
    actionTimer: 0,
    spawnpoints: [
        { x: 896,   y: 448, color:0x00FF00},
        { x: 960,   y: 512, color:0xFF0000},
        { x: 896,   y: 512, color:0xFFFF00},
        { x: 960,   y: 448, color:0x0000FF},
        { x: 832,   y: 384, color:0xFF00FF},
        { x: 1024,  y: 576, color:0x00FFFF},
        { x: 832,   y: 576, color:0x339933},
        { x: 1024,  y: 384, color:0x993333}
    ],

    create: function () {
        var that = this;

        // Run in background
        this.game.stage.disableVisibilityChange = true;
        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

        socket.on('input', function (input) {
            if (typeof that.players[input.userId] != "undefined") {
                var player = that.players[input.userId].player;
                player.inputDeltaX = input.deltaX;
                player.inputDeltaY = input.deltaY;
                player.facing = input.key;

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
                player.actionButton = input.actionButton;
            }
        });
        
        socket.on('users', function (updateUsers) {
            that.updatePlayers(updateUsers);
        });

        socket.emit('ready');

        this.physics.startSystem(Phaser.Physics.ARCADE);
        this.stage.backgroundColor = '#000000';

        this.bg = this.game.add.tileSprite(0, 0, 1920, 1024, 'backg');
        //bg.fixedToCamera = true;

        this.map = this.add.tilemap('level');
        this.map.addTilesetImage('tiles');
        this.map.setCollisionBetween(0, 99, true, "Walls");
        //this.map.setCollisionByExclusion([0], true, "Walls");
        //this.bg = this.map.createLayer('Background');
        this.layer = this.map.createLayer('Walls');
        //this.layer.debug = true;       //  Un-comment this on to see the collision tiles
        this.layer.resizeWorld();

        //  Here we create our coins group
        this.coins = this.game.add.group();
        this.coins.enableBody = true;
        this.map.createFromObjects('Items', 105, 'coin', 0, true, false, this.coins);
        this.coins.callAll('animations.add', 'animations', 'spin', [0, 1, 2, 3, 4, 5], 10, true);
        this.coins.callAll('animations.play', 'animations', 'spin');

        // Add Dangers
        /*
        danger = game.add.sprite(128, 64, 'danger');    
        game.physics.enable(danger, Phaser.Physics.ARCADE);
        danger.body.immovable = true;
        */

        },

    update: function () {
        stats.begin();
        
        var that = this;
        var movementSpeed = 100;

        Object.keys(this.players).forEach(function(userId) {
            var player = that.players[userId].player;
            that.game.physics.arcade.collide(player, that.layer);
            //that.game.physics.arcade.overlap(player, that.danger, that.dangerHandler, null, that);
            that.game.physics.arcade.overlap(player, that.coins, that.collectCoin, null, that);


            player.body.velocity.setTo(0, 0);

            player.body.velocity.x = player.inputDeltaX * movementSpeed;
            player.body.velocity.y = player.inputDeltaY * movementSpeed;
            if (player.body.velocity.x == 0 && player.body.velocity.y == 0)
            {
                if (player.facing != 'idle')
                {
                    player.animations.stop();
                    player.facing = 'idle';
                }
            } else {
                player.animations.play(player.facing);
            }
            if (player.actionButton && that.game.time.now > player.actionTimer)
            {

                player.actionTimer = that.game.time.now + 1000;
            }
        });

        stats.end();
    },

    collectCoin: function (player, coin) {
        coin.destroy();
        this.players[player.userId].score++;
        //player.text.setText(this.players[player.userId].name + ": " + this.players[player.userId].score);
        if (this.coins.length == 0) {
            this.endGame();
        }
    },

    endGame: function() {
        var winner = {score: 0};
        var highscore = [];
        var that = this;
        Object.keys(this.players).forEach(function(userId) {
            if (that.players[userId].score > winner.score) {
                winner = that.players[userId];
            }
            highscore.push({
                userId: userId,
                score: that.players[userId].score
            });

        });

        var style = { font: "64px Arial", fill: "#ffffff", align: "center", stroke: '#000000', strokeThickness: 5 };
        var winnerText = that.add.text(928, 480, "The winner is\n" + winner.name + "\nwith " + winner.score + " points" , style);
        winnerText.anchor.setTo(0.5, 0.5);

        setTimeout(function() {
            socket.emit('gameover', highscore);
        }, 3000); 

    },

    createPlayer: function(user) {
        // Add Players
        var spawnpoint = this.spawnpoints[Object.keys(this.players).length % 8];
        var player = this.game.add.sprite(spawnpoint.x, spawnpoint.y, 'characters');
        player.tint = spawnpoint.color;
        //player.tint = Math.random() * 0xffffff;
        this.game.physics.enable(player, Phaser.Physics.ARCADE);
        player.body.collideWorldBounds = true;
        player.body.setSize(22, 16, 5, 48);

        // Add Player animations
        player.animations.add('down', [0, 1, 2], 10, true);
        player.animations.add('left', [9, 10, 11], 10, true);
        player.animations.add('right', [18, 19, 20], 10, true);
        player.animations.add('up', [27, 28, 29], 10, true);
        player.facing = "down";
        player.userId = user.userId;

        var style = { font: "24px Arial", fill: "#ffffff", align: "center"};
        //player.text = this.add.text(288*(Object.keys(this.players).length + 1), 32, user.name + ": 0" , style);
        //player.text.anchor.setTo(0.5, 0.5);

        this.players[user.userId] = {
            userId: user.userId,
            name: user.name, 
            player: player,
            score: 0
        };
    },

    /* Player have joined or left the game */
    updatePlayers: function updatePlayers(newUsers) {
        var that = this;

        // Add new users
        newUsers.forEach(function(user) {
            if (typeof that.players[user.userId] === 'undefined') {
                that.createPlayer(user);
            }
        });
    },

};

window['phaser'] = window['phaser'] || {};
window['phaser'].Game = Game;
window['gameId'] = 'coinhunter';

}());
