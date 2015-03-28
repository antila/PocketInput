$('#submit').on('click', function() {
    var name = $('#username').val();
    socket.emit('setName', { name: name });
    localStorage.setItem("username", name);
    username = localStorage.getItem("username");
    startGame();
});

$(document).on('click', '#vote li', function() {
	var game = $(this).text();
	console.log(game);
    socket.emit('voteGame', game);
    $('#vote').hide();
});

function startGame() {
    $('#join').hide();
    $('h1 span').text(username);

    socket.emit('getGames');
}

socket.on('games', function(games) {
	var $vote = $('#vote ul');
    $vote.empty();

    games.forEach(function(game) {
        $('<li/>', {text: game }).appendTo($vote);
    });
});
