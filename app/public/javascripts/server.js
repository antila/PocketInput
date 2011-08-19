$.server = {};

function Server()
{
  console.log('Started Server');
  $.server.socket = io.connect('/');
  $.server.socket.emit('server start');
  
  $.server.socket.on('server start okay', function (data) {
    console.log('Server start okay!');

    $.mobile.changePage($('#server-hub'));
  });
  
  
}
 
Session.prototype.start = function(y)
{
  
}






