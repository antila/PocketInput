(function() {
  'use strict';

function Game() {

}

Game.prototype = {
    players: [],
    newUsers: [],
    phaser: null,

    create: function () {
        var that = this;

        // Run in background
        this.game.stage.disableVisibilityChange = true;

        socket.on('input', function (input) {
            var player = that.players[input.userId].player;
            that.players[input.userId].meter += Math.floor(input.shake.motion);

            if (that.players[input.userId].meter > 20000) {
                that.players[input.userId].meter = 20000;
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

            //player.cropRect.height = player.meter;
            //player.updateCrop();
        });
    },

    createPlayer: function(user, index) {

        var widthPerPlayer = this.game.world.width / 8;

        //var posX = this.game.width / ((this.newUsers.length * Object.keys(this.players).length) + 2);
        var posX = widthPerPlayer*((index%7) + 1);

        var posY = Math.ceil((index+1)/7)*128;

        var player= new Phaser.Rectangle(0, 0, widthPerPlayer, 128);
        //player.crop(new Phaser.Rectangle(0, 0, 128, 500));
        //player.anchor.setTo(0.5, 1);

        var style = { font: "24px Arial", fill: "#ffffff", align: "center"};
        //player.text = this.add.text(288*(Object.keys(this.players).length + 1), 32, user.name + ": 0" , style);
        player.text = this.add.text(posX, posY, user.name + ": 0" , style);
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
        this.newUsers = newUsers;

        // Add new users
        newUsers.forEach(function(user,index) {
            if (typeof that.players[user.userId] === 'undefined') {
                //for (var i = 10 - 1; i >= 0; i--) {
                    that.createPlayer(user,index);
                //};
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
                score: Math.round(that.players[userId].meter/200)
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
window['gameId'] = 'skakaburken';

}());
