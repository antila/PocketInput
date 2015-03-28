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
            that.players[input.userId].player.isAngry = (input.touch === true);
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
            if (player.isAngry === true) {
                var rand = Math.random() + 0.5; 
                player.scale.x = rand;
                player.scale.y = rand;
            } else {
                player.scale.x = 1;
                player.scale.y = 1;
            }
        });
    },

    createPlayer: function(user) {
        var posX = (Object.keys(this.players).length) * 160 + 100;
        var posY = 100;

        var player = this.game.add.sprite(posX, posY, 'player');
        player.anchor.setTo(0.5, 0.5);
        player.isAngry = false;

        var style = { font: "12px Arial", fill: "#ff0044", align: "center" };
        var text = this.add.text(posX, posY + 80, user.name, style);
        text.anchor.setTo(0.5, 0.5);

        this.players[user.userId] = {
            userId: user.userId,
            player: player,
            text: text
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

}());



