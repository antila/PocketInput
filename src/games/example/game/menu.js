(function() {
  'use strict';

  function Menu() {
    this.titleTxt = null;
    this.startTxt = null;
  }

  Menu.prototype = {

    create: function () {
      // instantly go to game, for development:
      // this.game.state.start('game');
      // return;

      var that = this;
      var x = this.game.width / 2
        , y = this.game.height / 2;

      var count = 3;

      this.titleTxt = this.add.bitmapText(x, y, 'minecraftia', 'Example Game' );
      this.titleTxt.align = 'center';
      this.titleTxt.x = this.game.width / 2 - this.titleTxt.textWidth / 2;

      y = y + this.titleTxt.height + 5;
      this.startTxt = this.add.bitmapText(x, y, 'minecraftia', 'STARTING ' + count);
      this.startTxt.align = 'center';
      this.startTxt.x = this.game.width / 2 - this.startTxt.textWidth / 2;
      
      // this.input.onDown.add(this.onDown, this);

      var interval = setInterval(function() {
        that.startTxt.text = 'STARTING ' + --count;
        if (count <= 0) {
          clearInterval(interval);
          that.game.state.start('game');
        }
      }, 1000);
    },

    update: function () {

    },

    // onDown: function () {
    //   this.game.state.start('game');
    // }
  };

  window['phaser'] = window['phaser'] || {};
  window['phaser'].Menu = Menu;

}());
