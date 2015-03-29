(function() {
  'use strict';

function Game() {

}

Game.prototype = {
    players: [],
    phaser: null,

    create: function () {
        var that = this;

        // Run in background
        this.game.stage.disableVisibilityChange = true;

        socket.on('input', function (input) {
            var player = that.players[input.userId].player;
            that.players[input.userId].meter += input.shake.motion;

            if (that.players[input.userId].meter > 500) {
                that.players[input.userId].meter = 500;
                that.endGame();
            }

            player.text.setText(that.players[input.userId].name + ": " + that.players[input.userId].meter);
        });
        
        socket.on('users', function (updateUsers) {
            that.updatePlayers(updateUsers);
        });

        socket.emit('ready');

    },

    update: function () {
        var that = this;

        Object.keys(this.players).forEach(function(userId) {
            var player = that.players[userId].player;

            player.cropRect.height = player.meter;
            player.updateCrop();
        });
    },

    createPlayer: function(user) {
        var posX = (Object.keys(this.players).length) * 160 + 100;
        var posY = 100;

        var player = this.game.add.sprite(posX, posY, 'player');
        player.crop(new Phaser.Rectangle(0, 0, 128, 500));
        player.anchor.setTo(0.5, 0.5);

        var style = { font: "24px Arial", fill: "#ffffff", align: "center"};
        player.text = this.add.text(288*(Object.keys(this.players).length + 1), 32, user.name + ": 0" , style);
        player.text.anchor.setTo(0.5, 0.5);

        this.players[user.userId] = {
            userId: user.userId,
            name: user.name,
            player: player,
            meter: 0,
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

    endGame: function () {
        var winner = {meter: 0};
        var highscore = [];
        var that = this;

        Object.keys(this.players).forEach(function(userId) {
            var player = that.players[userId].player;
            if (that.players[userId].meter > winner.meter) {
                winner = that.players[userId];
            }
            highscore.push({
                userId: userId,
                score: Math.round(that.players[userId].meter.meter/10)
            });
        });

        var style = { font: "64px Arial", fill: "#ffffff", align: "center", stroke: '#000000', strokeThickness: 5 };
        var winnerText = that.add.text(928, 480, "The winner is\n" + winner.name, style);
        winnerText.anchor.setTo(0.5, 0.5);
        
        setTimeout(function() {
            socket.emit('gameover', highscore);
        }, 3000); 
    }

};

window['phaser'] = window['phaser'] || {};
window['phaser'].Game = Game;

}());



