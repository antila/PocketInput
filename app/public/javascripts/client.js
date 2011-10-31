$.client = new Client();

function Client()
{
 
}

Client.prototype.game = '';

Client.prototype.connect = function() {

  this.socket = io.connect();
  this.session = new Session(this.socket);
  
  // Events
  this.socket.on('goToGame', function (data) {
    console.log('Client: go to game');
    //console.log(data);
    $.client.addChatMessage('Client', 'Go to game: ');
    //$.mobile.changePage($('#server-hub'));
  });

  this.socket.on('nickname okay', function (data) {
    console.log('Nickname okay!');
    console.log(data);
    console.log($.client.session);

    console.log($.client.session.setSession({name: data.name}));
    console.log('Opening page: hub');
    $.mobile.changePage($('#hub'));
  });

  this.socket.on('nickname failed', function (data) {
    console.log('Nickname failed!');
      
    //$.client.session.login();
  });

  this.socket.on('chat', function (data) {
    console.log(data);
    $.client.addChatMessage(data.name, data.message);
  });

  this.socket.on('onConnect', function (data) {
    console.log('received onconnect');
    $.client.onConnect();
  });
  
  this.socket.on('goToGame', function (data) {
    console.log('Go to game');
    console.log(data);
    
    if ($('#game-client-'+data.game).length > 0) {
      $.mobile.changePage($('#game-client-'+data.game));
      this.game = new PocketmanClient();
    } else {
      console.log('No such game: '+data.game);
    }
    //$.mobile.changePage($('#server-hub'));
  });
}

Client.prototype.addChatMessage = function(name, message) {
  var item = $('ul#chat').append('<li><span>'+name+'</span>'+message+'</li>');
  $('ul#chat li:last').addClass('ui-li ui-li-static ui-body-c');
}

Client.prototype.sendChatMessage = function(username, usermessage) {
  console.log('Sending '+username+' from '+usermessage);
  this.addChatMessage(username, usermessage);
  this.socket.emit('msg', { message: usermessage });
}

Client.prototype.sendInput = function(input) {
  this.socket.emit('sendInput', { input: input });
}

Client.prototype.onConnect = function() {
  console.log('onConnect');
  
  var username = $.client.session.getUsername();
  console.log('Username: '+username);
  
  if (username && username !== '' && username.length > 0) {
    // Accepted username
    
    console.log('Sending username: '+username);
    $.client.socket.emit('set nickname', { name: username });

  } else {
    console.log('not accepted');
    $.mobile.changePage($('#login-page'));
  }
  //addChatMessage(data.name, data.message);
}

Client.prototype.session = new Session(this.socket);


$('#root').live('pagecreate',function(event){
  console.log('root: Document ready');
  $.client.session.login();
  //socket.emit('onConnect', { message: 'usermessage', name: 'username' });
});

$('#login-page').live('pagecreate',function(event){
  console.log('login: Document ready');
  //$.client.session.login();
  //socket.emit('onConnect', { message: 'usermessage', name: 'username' });
});

$('#hub').live('pagecreate',function(event){
  $('#sendchat').click(function(e){
    var name = $.client.session.username;
    var message = $('#chatinput').val();
    $.client.sendChatMessage(name, message);
    return false;
  });
   
  $('#button-logout').click(function(e){
    console.log('logout');
    $.client.session.logout();
  });
    
  $.client.session.checkLogin();
});

$('#logout').live('pagecreate',function(event){
  
  console.log($.client.socket);
  
  if (typeof($.client.socket) === 'undefined' ) {
    $.mobile.changePage($('#login-page'));
  } else {
    window.location.reload();
  }
});

$(document).bind('pagecreate',function(event){
  // Login
  $('#loginform').submit(function(data){
    
    if (typeof($.client.socket) !== 'undefined' ) {
      console.log('Client: Trying to connect while already logged in');
      $.client.onConnect();
      return false;
    } else {
      console.log('Client: No client, connecting.');
      $.client.connect();
      return false;
    }
    
  });
  
  $('#startserver').unbind('submit');
  $('#startserver').submit(function(data){
    //if (typeof($.server) == 'undefined' ) {
      $.server.connect();
    //}
    return false;
  });
  
  // Start server
});

$('.game').live('pagecreate',function(event){
  if (typeof($.server.socket) == 'undefined' ) {
    $.mobile.changePage($('#hub'));
  }
});

