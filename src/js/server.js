var socket = io('http://10.131.6.124');
  
// socket.on('users', function (updateUsers) {
//     console.log('updateUsers', updateUsers);
//     var $playerList = $('#players');
//     $playerList.empty();
//     updateUsers.forEach(function(user) {
//         var name = user.id;
//         if (typeof user.name !== 'undefined') {
//             name = user.name;
//         }
//         $('<li/>', {text: user.userId + ': ' + name}).appendTo($playerList);
//     });

//     if (typeof window['phaser'].Game.prototype.updatePlayers === 'function') {
//         window['phaser'].Game.prototype.updatePlayers(updateUsers);
//     }
// });

$('#navbar a').on('click', function(event) {
    var clientDestination = $(this).attr('clientDestination');
    var serverDestination = $(this).attr('href');
    socket.emit('destination', {
        client: clientDestination,
        server: serverDestination
    });
    event.preventDefault();
});

socket.on('destination', function (destination) {
    window.location = destination;
});