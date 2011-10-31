function PocketmanServer(users)
{
  console.log('PocketmanServer');
  console.log(users);
  
  $('#play').empty();
  
  for (user in users) {
      console.log('u: '+user+', name: '+users[user]);
      var player = $('<div>'+users[user]+'</div>');
      
      var x = $('#play').height() * Math.random();
      var y = $('#play').width() * Math.random();
      
      player.css('left', x);
      player.css('top', y);
      player.attr('id', users[user]);
      
      player.appendTo('#play');
  }
}

PocketmanServer.prototype.onInput = function(nickname, input) {
  console.log('Game got input: '+input+' from '+nickname);
  $('body').append('<p>'+input+'</p>');
  
  var player = $('#'+nickname);
  console.log(player);
  console.log(player.css('top'));
  console.log(player.css('left'));

  var x = Math.round(player.css('top').replace('px', ''));
  var y = Math.round(player.css('left').replace('px', ''));
  console.log(x);
  console.log(y);
  
  if (input == 'Up') {
      player.css('top', (x-20)+'px');
  }
  
  if (input == 'Down') {
      player.css('top', (x+20)+'px');
  }
  
  if (input == 'Left') {
      player.css('left', (y-20)+'px');
  }
  
  if (input == 'Right') {
      player.css('left', (y+20)+'px');
  }
  
}
