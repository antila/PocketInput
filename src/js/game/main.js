window.onload = function () {
  'use strict';

  var game
    , ns = window['phaser'];

  if (typeof invadersHack !== 'undefined') {
    game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-game');
} else {

  game = new Phaser.Game(1920, 1080, Phaser.AUTO, 'phaser-game');
}
  game.state.add('boot', ns.Boot);
  game.state.add('preloader', ns.Preloader);
  game.state.add('menu', ns.Menu);
  game.state.add('game', ns.Game);
  /* yo phaser:state new-state-files-put-here */

  game.state.start('boot');
};
