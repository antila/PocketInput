$('#ip').text(server);

new QRCode(document.getElementById("qrcode"), "http://" + server + '/lobby-client.html');

var users;
socket.on('users', function (updateUsers) {
    console.log('users', updateUsers);
    users = updateUsers;
    var $playerList = $('#players');
    $playerList.empty();

    updateUsers.forEach(function(user, position) {
        var name = user.id;
        if (typeof user.name !== 'undefined') {
            name = user.name;
        }

        var $tr = $('<tr/>').appendTo($playerList);
        $('<td/>', {text: position + 1 }).appendTo($tr);
        $('<td/>', {text: name }).appendTo($tr);
        $('<td/>', {html: '&#151;' }).appendTo($tr);
    });
});

socket.on('votes', function (votes) {
    var totalVotes = 0;

    var $votes = $('#votes');
    $votes.empty();

    Object.keys(votes).forEach(function(map, position) {
        totalVotes += votes[map];

        var $tr = $('<tr/>').appendTo($votes);
        $('<td/>', {text: position + 1 }).appendTo($tr);
        $('<td/>', {text: map }).appendTo($tr);
        $('<td/>', {text: votes[map] }).appendTo($tr);

        $tr.attr('data-map', map);
        $tr.attr('data-votes', votes[map]);
    });

    $votes.find('li').sort(asc_sort).appendTo($votes);
    //$("#debug").text("Output:");
    // accending sort
    function asc_sort(a, b){
        return ($(a).attr('data-votes')) < ($(b).attr('data-votes')) ? 1 : -1;    
    }

    $('#votecount').text(totalVotes +'/' + users.length);
    
    if (totalVotes >= users.length && users.length > 0) {
        var map = $('#votes tr:first').attr('data-map');
        gotoGame(map);
    }
});

var countDown = 30;
setInterval(function() {
    $('#countdown').text(countDown--);

    if (countDown < 0) {    
        var map = $('#votes tr:first').attr('data-map');
        gotoGame(map);
    }
}, 1000);

socket.on('lastHighscore', function (highscore) {
    if (highscore === null) {
        return;
    }
    var $score = $('#last-game');
    $score.empty();

    highscore.forEach(function(item, position) {
        var score = item.score;
        
        users.forEach(function(user) {
            var name = user.userId;
            if (typeof user.name !== 'undefined') {
                name = user.name;
            }

            if (user.userId === item.userId) {
                var $tr = $('<tr/>').appendTo($score);
                $('<td/>', {text: position+1 }).appendTo($tr);
                $('<td/>', {text: name }).appendTo($tr);
                $('<td/>', {text: score }).appendTo($tr);
            }
        });
    });
});

function gotoGame(map) {
    console.log('goito', map);
    if (typeof map === 'undefined' || map === 'undefined') {
        setTimeout(function() {
            window.location.reload();
        }, 1500); 
    } else {
        socket.emit('destination', map);
    }
}

socket.emit('ready');

socket.emit('gotoLobby');