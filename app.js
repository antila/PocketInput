
/**
 * Module dependencies.
 */

var express = require('express');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

console.log(server.address());

server.listen(80);

app.use(express.static('dist'));
app.use(express.static('src'));

var users = [];
var lastHighscore;

var games = ['invaders', 'example'];
var votes = {};

io.on('connection', function (socket) {
  socket.on('disconnect', function() {
    console.log('Got disconnect!');

      users.forEach(function(user, i) {
        if (user.userId === socket.userId) {
          console.log('removing', user);
          users.splice(i--, 1);
        }
      });

      socket.broadcast.emit('users', users);
      socket.emit('users', users);
  });

  console.log('connected', socket.id);

  socket.emit('users', users);
  socket.broadcast.emit('users', users);

  socket.on('input', function (data) {
    socket.broadcast.emit('input', data);
  });   

  socket.on('ready', function (data) {
    socket.emit('users', users);
    socket.emit('lastHighscore', lastHighscore);
    socket.emit('votes', votes );
  });  

  socket.on('gameover', function (data) {
    lastHighscore = data;
    socket.emit('destination', '/lobby-server.html');
    socket.broadcast.emit('destination', '/lobby-client.html');
  });    

  socket.on('destination', function (data) {
    votes = {};
    socket.emit('destination', data.server);
    socket.broadcast.emit('destination', data.client);
  });

  socket.on('getGames', function () {
    socket.emit('games', games);
  });

  socket.on('voteGame', function (game) {
    if (typeof votes[game] === 'undefined') {
      votes[game] = 1;
    } else {
      votes[game]++;
    }

    socket.broadcast.emit('votes', votes );
    // socket.emit('votes', votes );
  });

  socket.on('setName', function (data) {
    console.log('setName', data);
      users.forEach(function(user, i) {
        if (user.userId === socket.userId) {
          users[i].name = data.name;
        }
      });

      socket.emit('users', users);
      socket.broadcast.emit('users', users);
  });

  socket.on('setId', function (userId) {
    console.log('setId', userId);

    var foundUser = false;
      users.forEach(function(user, i) {
        if (user.userId === socket.userId) {
          foundUser = true;
        }
      });
    if (foundUser === false) {
      console.log('adding');
      socket.userId = userId
      users.push({userId: userId});
    }

      socket.emit('users', users);
      socket.broadcast.emit('users', users);
  });
});