$('#submit').on('click', function() {
    var name = $('#username').val();
    socket.emit('setName', { name: name });
    localStorage.setItem("username", name);
    username = localStorage.getItem("username");
    startGame();
});

function startGame() {
    $('#join').hide();
    $('h1 span').text(username);
}
