$('#submit').on('click', function() {
    var name = $('#username').val();
    socket.emit('setName', { name: name });
    localStorage.setItem("username", name);
    username = localStorage.getItem("username");
    playerJoined();
});

$(document).on('click', '#vote a', function() {
    $('#vote .btn-primary').removeClass('btn-primary');
    $(this).addClass('btn-primary');
	var game = $(this).text();
	console.log(game);
    socket.emit('voteGame', {
        userId: userId,
        map: game
    });
    // $('#vote').hide();
});

function playerJoined() {
    console.log('playerJoined');
    $('.container-fluid.join').hide();
    $('.navbar').show().removeClass('hide');
    $('.container-fluid.vote').show().removeClass('hide');
    $('#name').text(username);

    socket.emit('getGames');
}

function joinForm() {
    console.log('joinForm');
    $('.container-fluid.join').show().removeClass('hide');
    $('#username').text(username);

    socket.emit('getGames');
}

$('#logout').on('click', function() {
    localStorage.removeItem("username");
    window.location.reload();
});

socket.on('games', function(games) {
	var $vote = $('#vote');
    $vote.empty();

    games.forEach(function(game) {
        
        $('<a/>', {text: game, class: 'btn btn-default btn-lg btn-block' }).appendTo($vote);
    });
});

// $('.container-fluid').removeClass('hide');