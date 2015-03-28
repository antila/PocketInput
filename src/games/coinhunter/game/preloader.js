(function() {
  'use strict';

  function Preloader() {
    this.asset = null;
    this.ready = false;
  }

  Preloader.prototype = {

    preload: function () {
      this.asset = this.add.sprite(this.game.width * 0.5 - 110, this.game.height * 0.5 - 10, 'preloader');

      this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
      this.load.setPreloadSprite(this.asset);
      
      this.loadResources();
    },
      
    loadResources: function () {
      // Load levels
      //this.load.tilemap('level', 'games/coinhunter/assets/level-1.json', null, Phaser.Tilemap.TILED_JSON);
      this.load.tilemap('level', '/games/coinhunter/assets/level-2.json', null, Phaser.Tilemap.TILED_JSON);
      
      // Load Tiles
      //this.load.image('functions', 'games/coinhunter/assets/functions.png');
      this.load.image('tiles', '/games/coinhunter/assets/tiles.png');
      this.load.spritesheet('coin', '/games/coinhunter/assets/coin.png', 32, 32);

      // Load characters
      this.load.spritesheet('characters', '/games/coinhunter/assets/characters.png', 32, 64);

      // Load fonts
      this.load.bitmapFont('minecraftia', '/assets/minecraftia.png', '/assets/minecraftia.xml');
    },

    create: function () {
      this.asset.cropEnabled = false;
    },

    update: function () {
      if (!!this.ready) {
        this.game.state.start('menu');
      }
    },

    onLoadComplete: function () {
      this.ready = true;
    }
  };

  window['phaser'] = window['phaser'] || {};
  window['phaser'].Preloader = Preloader;

}());
