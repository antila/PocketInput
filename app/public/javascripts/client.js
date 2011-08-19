$.client = {};
$.client.socket = io.connect('/');
$.client.session = new Session($.client.socket);
  
$.client.socket.on('news', function (data) {
  console.log(data);
  $.client.socket.emit('my other event', { my: 'data' });
});

$.client.socket.on('nickname okay', function (data) {
  console.log('Nickname okay!');
  console.log(data);
  console.log($.client.session);

  console.log($.client.session.setSession({name: data.name}));
  console.log('Opening page: hub');
  $.mobile.changePage($('#hub'));
});

$.client.socket.on('nickname failed', function (data) {
  console.log('Nickname failed!');
    
  $.client.session.login();
});

$.client.socket.on('chat', function (data) {
  console.log(data);
  addChatMessage(data.name, data.message);
});

$.client.socket.on('onConnect', function (data) {
  console.log('onConnect');
  console.log(data);
  //addChatMessage(data.name, data.message);
});

$('#root').live('pagecreate',function(event){
  console.log('Document ready');
  $.client.session.login();
  //socket.emit('onConnect', { message: 'usermessage', name: 'username' });
});

$('#hub').live('pagecreate',function(event){
  $('#sendchat').click(function(e){
    var name = $.client.session.username;
    var message = $('#chatinput').val();
    sendChatMessage(name, message);
    return false;
  });
   
    $('#button-logout').click(function(e){
    console.log('logout');
        $.client.session.logout();
  });
    
  $.client.session.checkLogin();
});

function addChatMessage(name, message) {
  var item = $('ul#chat').append('<li><span>'+name+'</span>'+message+'</li>');
  $('ul#chat li:last').addClass('ui-li ui-li-static ui-body-c');
}

function sendChatMessage(username, usermessage) {
  console.log('Sending '+username+' from '+usermessage);
  addChatMessage(username, usermessage);
  $.client.socket.emit('msg', { message: usermessage });
}
