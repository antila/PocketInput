(function () {
  'use strict';

  function Boot() {}

  Boot.prototype = {
    
    preload: function () {
      this.load.image('preloader', 'assets/preloader.gif');
    },

    create: function () {
      this.game.input.maxPointers = 1;

      if (this.game.device.desktop) {
        this.game.scale.pageAlignHorizontally = true;
      } else {
        this.game.scale.forceOrientation(true);
        this.game.scale.pageAlignHorizontally = true;
        this.game.scale.setScreenSize(true);
        this.game.stage.disableVisibilityChange = true;
        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
      }
      this.game.state.start('preloader');
    }
  };

  window['phaser'] = window['phaser'] || {};
  window['phaser'].Boot = Boot;

}());

