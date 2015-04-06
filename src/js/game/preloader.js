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
      var that = this;

      var gameInfo = this.game.cache.getJSON('gameInfo');

      /* Load game assets --------------------------------------------------- */
      // Images
      if (typeof gameInfo.preload.images !== 'undefined') {
        gameInfo.preload.images.forEach(function(asset) {
          that.load.image(asset.id, asset.url);      
        });
      }

      // Tilemaps
      if (typeof gameInfo.preload.tilemaps !== 'undefined') {
        gameInfo.preload.tilemaps.forEach(function(asset) {
          that.load.tilemap(asset.id, asset.url, null, Phaser.Tilemap.TILED_JSON);
        });
      }

      // Spritesheets
      if (typeof gameInfo.preload.spritesheets !== 'undefined') {
        gameInfo.preload.spritesheets.forEach(function(asset) {
          that.load.spritesheet(asset.id, asset.url, asset.width, asset.height);
        });
      }

      // JSON Spritesheets
      if (typeof gameInfo.preload.atlasjson !== 'undefined') {
        gameInfo.preload.atlasjson.forEach(function(asset) {
          console.log('loading', asset.id);
          that.load.atlasJSONHash(asset.id, asset.url, asset.json);
        });
      }

      this.game.load.image('instructions', gameInfo.instructions);

      /* Load menu assets --------------------------------------------------- */
      // Background
      this.game.load.image('block', '/assets/kenney.nl/background-elements/PNG/Flat/hills1.png');
      this.game.load.image('clouds1', '/assets/kenney.nl/background-elements/PNG/Flat/clouds1.png');
      this.game.load.image('clouds2', '/assets/kenney.nl/background-elements/PNG/Flat/clouds2.png');

      // Font generated with http://kvazars.com/littera/
      this.game.load.bitmapFont('nexarust', '/assets/fonts/nexarust.png', '/assets/fonts/nexarust.fnt');
      this.game.load.bitmapFont('amatic', '/assets/fonts/amatic.png', '/assets/fonts/amatic.fnt');
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
