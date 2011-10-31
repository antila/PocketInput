$.server = new Server();
    
function Server()
{
  
}

Server.prototype.game = '';

Server.prototype.connect = function() {
  //console.log($.server.socket);
  
  console.log('Started Server');
  this.socket = io.connect('/');
  this.socket.emit('server start');
  
    
  this.socket.on('server start okay', function (data) {
    console.log('Server start okay!');

    $.mobile.changePage($('#server-hub'));
  });

  this.socket.on('goToGame', function (data) {
    console.log('Server: go to game');
    console.log(data);

    if ($('#game-server-'+data.game).length > 0) {
      $.mobile.changePage($('#game-server-'+data.game));
      this.game = new PocketmanServer(data.users);
    } else {
      console.log('No such game: '+data.game);
    }
  });
  
  this.socket.on('playerInput', function (data) {
    console.log('Server - Got input: '+data.input);
    console.log(data);

    this.game.onInput(data.nickname, data.input);
  });
}
 
Server.prototype.startGame = function(gameId)
{
  console.log('wants to start game '+ gameId);
  this.socket.emit('startGame', { game: gameId });
}

$('#server-hub').live('pagecreate',function(event){
  $('#games input').unbind('click');
  $('#games input').click(function(e){
    var gameId = $(this).val();
    $.server.startGame(gameId);
    return false;
  });
  
  if (typeof($.server.socket) == 'undefined' ) {
    $.server.connect();
  }
});

$('.game-server').live('pagecreate',function(event){
  if (typeof($.server.socket) == 'undefined' ) {
    $.server.connect();
  }
});

