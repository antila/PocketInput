var users;
socket.on('users', function (updateUsers) {
    users = updateUsers;
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

var totalVotes = 0;
socket.on('votes', function (votes) {
    var $votes = $('#votes');
    $votes.empty();

    Object.keys(votes).forEach(function(map) {
        totalVotes += votes[map];
        var $map = $('<li/>', {text: map+ ': ' + votes[map]}).appendTo($votes);
        $map.attr('data-map', map);
    });

    if (totalVotes >= users.length) {
        var map = $('#votes li:first').attr('data-map');
        $('#navbar a[data-map=' + map + ']').click();
    }
});

socket.on('lastHighscore', function (highscore) {
    if (highscore === null) {
        return;
    }
    var $score = $('#last-game');
    $score.empty();
    highscore.forEach(function(item) {
        console.log(item);
        var score = item.score;
        
        users.forEach(function(user) {
            console.log(user);
            var name = user.userId;
            if (typeof user.name !== 'undefined') {
                name = user.name;
            }
            if (user.userId === item.userId) {
                $('<li/>', {text: name + ': ' + score + ' points.'}).appendTo($score);
            }
        });
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

socket.emit('ready');