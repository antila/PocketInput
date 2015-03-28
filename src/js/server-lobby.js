socket.on('users', function (updateUsers) {
    var $playerList = $('#players');
    $playerList.empty();
    updateUsers.forEach(function(user) {
        var name = user.id;
        if (typeof user.name !== 'undefined') {
            name = user.name;
        }
        $('<li/>', {text: name}).appendTo($playerList);
    });
});

$('#navbar a').on('click', function(event) {
    var clientDestination = $(this).attr('clientDestination');
    var serverDestination = $(this).attr('href');
    socket.emit('destination', {
        client: clientDestination,
        server: serverDestination
    });
    event.preventDefault();
});