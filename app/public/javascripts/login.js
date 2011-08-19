function Login(socket)
{
    $.mobile.changePage($('#login-page'));
}

$(document).bind('pagecreate',function(event){
  // Login
  $('#loginform').submit(function(data){
    if ($('#nickname').val() !== '') {
      // Accepted username
      var username = $('#nickname').val();
      
      console.log('Sending username: '+username);
      $.client.socket.emit('set nickname', { name: username });

    } else {
      console.log('not accepted');
    }
    //console.log(data);
    return false;
  });
  
  $('#startserver').submit(function(data){
    $.server = new Server();
    return false;
  });
  
  // Start server
});

