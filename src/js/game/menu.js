(function() {
  'use strict';

  function Menu() {
    this.startTxt = null;
  }

  Menu.prototype = {
    create: function () {
      // instantly go to game, for development:
      // this.game.state.start('game');
      // return;

      this.createBackground();   
      this.createGameNameText();
      this.createInstructions();
      this.createFadeInScreen();
    },

    createBackground: function() {
      this.game.stage.backgroundColor = '#b6d6e3';

      this.clouds1 = this.game.add.tileSprite(0, 0, 2002, 206, 'clouds1');
      this.clouds1.y = 0;
      this.clouds1.x = -100;
      this.clouds1.scale = {x: 2, y: 2};
      // this.clouds1.alpha = 0.5;
      this.clouds1.tint = 0xdef1f8;
      
      this.clouds2 = this.game.add.tileSprite(0, 0, 2002, 246, 'clouds2');
      this.clouds2.y = 110;
      this.clouds2.x = -800;
      this.clouds2.scale = {x: 2, y: 2};
      // this.clouds2.alpha = 0.6;
      this.clouds2.tint = 0xd9ebf2;

      this.clouds3 = this.game.add.tileSprite(0, 0, 2002, 246, 'clouds2');
      this.clouds3.y = 300;
      this.clouds3.x = -500;
      this.clouds3.scale = {x: 2, y: 2};
      // this.clouds3.alpha = 0.8;
      this.clouds3.tint = 0xf8fdff;

      this.hills = this.game.add.tileSprite(0, 0, 2002, 128, 'block');
      this.hills.y = 600;
      this.hills.x = 0;
      this.hills.scale = {x: 2, y: 2};

      this.ground = this.game.add.graphics(0, 0);
      this.ground.beginFill(0xd5edf7, 1);
      this.ground.drawRect(0, 750, this.game.width, this.game.height);
      this.ground.alpha = 1;
      this.ground.endFill();   
    },

    createGameNameText: function() {
      var gameInfo = this.game.cache.getJSON('gameInfo');
      this.gameNameText = this.game.add.bitmapText(100, 20, 'nexarust', gameInfo.name, 90);
      this.gameNameText.alpha = 0
      this.gameNameText.angle = -3;
    },

    createInstructions: function() {
      this.instructions = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'instructions');
      this.instructions.anchor.setTo(0.5, 0.5);
      this.instructions.alpha = 0;
      this.instructions.scale.x = 1.2;
      this.instructions.scale.y = 1.2;

    },

    showInstructions: function() {
      // Animate in instructions
      this.instructions.alpha = 0.4;
      var bounceIn = this.game.add.tween(this.instructions.scale).to( { y: 1, x: 1 }, 350, Phaser.Easing.Bounce.Out, true);
      this.game.add.tween(this.instructions).to( { alpha: 1 }, 250, 'Linear', true);
      
      bounceIn.onComplete.add(function() { 
        // Animate in game name
        this.game.add.tween(this.gameNameText).to( { y: 80 }, 450, Phaser.Easing.Bounce.Out, true);
        var tween = this.game.add.tween(this.gameNameText).to( { alpha: 1 }, 450, 'Linear', true);
        tween.onComplete.add(function() { 
          this.startCountDown();
        }, this);
      }, this);
    },

    startCountDown: function() {
      var that = this;
      this.countdownTime = 6;

      this.startTxt = this.add.bitmapText(1450, 900, 'amatic', 'Starting: ' + --that.countdownTime, 128);
      this.startTxt.alpha = 0;
      var tween = this.game.add.tween(that.startTxt).to( { alpha: 1 }, 450, 'Linear', true);

      var interval = setInterval(function() {
        that.startTxt.text = 'Starting: ' + --that.countdownTime;
        if (that.countdownTime <= 0) {
          var tween = that.game.add.tween(that.blackBox).to( { alpha: 1 }, 400, "Linear", true);
          
          tween.onComplete.add(function() {
            // Start game
            this.game.stage.backgroundColor = '#000000';
            clearInterval(interval);
            that.game.state.start('game');
          }, that);
        }
      }, 1000);
    },

    createFadeInScreen: function() {
      this.blackBox = this.game.add.graphics(0, 0);
      this.blackBox.beginFill(this.fadeColor, 1);
      this.blackBox.drawRect(0, 0, this.game.width, this.game.height);
      this.blackBox.alpha = 1;
      this.blackBox.endFill();

      var tween = this.game.add.tween(this.blackBox).to( { alpha: 0 }, 400, "Linear", true);

      tween.onComplete.add(function() { 
        this.showInstructions();
      }, this);
    },

    update: function () {
      if (typeof this.hills !== 'undefined') {
        this.hills.x -= 1;
        this.clouds1.x += 0.3;
        this.clouds2.x += 0.4;
        this.clouds3.x += 0.6;
        this.clouds3.y -= 0.1;
      }
    }
  };

  window['phaser'] = window['phaser'] || {};
  window['phaser'].Menu = Menu;

}());
