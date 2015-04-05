/**
 * Module dependencies.
 */
var express = require('express');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var fs = require('fs');
var os = require('os');

var ip;

// Get IP and interface
// http://stackoverflow.com/questions/3653065/get-local-ip-address-in-node-js
var ifaces = os.networkInterfaces();
Object.keys(ifaces).forEach(function (ifname) {
  var alias = 0;

  ifaces[ifname].forEach(function (iface) {
    if ('IPv4' !== iface.family || iface.internal !== false) {
      // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
      return;
    }

    if (alias >= 1) {
      // this single interface has multiple ipv4 addresses
      console.log('Running server on interface ' + ifname + ':' + alias + ', IP:', iface.address);
    } else {
      // this interface has only one ipv4 adress
      console.log('Running server on interface ' + ifname + ', IP:', iface.address);
    }
    ip = iface.address;
  });
});

// Write IP to file, for config
fs.writeFile("./src/js/address.js", 'var server = "' + ip + '";'); 

server.listen(80);

app.use(express.static('dist'));
app.use(express.static('src'));

var users = [];
var lastHighscore;

var games = ['invaders', 'example', 'coinhunter', 'skakaburken'];

var votes = {};

io.on('connection', function (socket) {
  socket.on('disconnect', function() {
    users.forEach(function(user, i) {
      if (user.userId === socket.userId) {
        console.log(user.name, 'wants to leave');
        user.timeout = setTimeout(function() {
          console.log(user.name, 'disconnected');
          users.splice(i--, 1);

          sendUsers();
        }, 15000);
      }
    });

  });

  sendUsers();

  socket.on('input', function (data) {
    socket.broadcast.emit('input', data);
  });   

  socket.on('ready', function (data) {
    sendUsers();
    socket.emit('lastHighscore', lastHighscore);
    socket.emit('votes', votes );
  });  

  socket.on('gameover', function (data) {
    data.sort(function(a, b){
      return a.score < b.score;
    });

    lastHighscore = data;
    socket.emit('destination', 'http://' + ip + '/lobby-server.html');
    socket.broadcast.emit('destination', 'http://' + ip + '/lobby-client.html');
  });    

  socket.on('gotoLobby', function () {
    socket.emit('destination', 'http://' + ip + '/lobby-server.html');
    socket.broadcast.emit('destination', 'http://' + ip + '/lobby-client.html');
  });    

  socket.on('destination', function (data) {
    votes = {};
    socket.emit('destination', 'http://' + ip + data.server);
    socket.broadcast.emit('destination', 'http://' + ip + data.client);
  });

  socket.on('getGames', function () {
    socket.emit('games', games);
  });

  socket.on('voteGame', function (data) {
    var map = data.map;
    votes = {};
    
    users.forEach(function(user, i) {
      if (user.userId === data.userId) {
        console.log(users[i].name, 'voted for', map);
        users[i].vote = map;
      }
    });

    users.forEach(function(user, i) {
      var votedMap = users[i].vote;
      if (typeof votedMap !== 'undefined') {
        if (typeof votes[votedMap] === 'undefined') {
          votes[votedMap] = 1;
        } else {
          votes[votedMap]++;
        }
      }
    });

    socket.broadcast.emit('votes', votes );
  });

  socket.on('setName', function (data) {
    users.forEach(function(user, i) {
      if (user.userId === data.userId) {
        console.log(data.userId + ' is ' + data.name);
        users[i].name = data.name;
      }
    });

    markAsReconnected();

    sendUsers();
  });

  socket.on('setId', function (userId) {
    socket.userId = userId;
    
    var foundUser = false;
      users.forEach(function(user, i) {
        if (user.userId === userId) {
          foundUser = true;
        }
      });
    if (foundUser === false) {
      console.log('new user: ' + userId);
      
      users.push({userId: userId});
    }

    markAsReconnected();

    sendUsers();
  });
  
  function sendUsers() {
    var sendUsers = users.map(function(user) {
      return {
        userId: user.userId,
        name: user.name,
        vote: user.vote
      }
    });
    socket.emit('users', sendUsers);
    socket.broadcast.emit('users', sendUsers);
  }

  function markAsReconnected() {
    users.forEach(function(user, i) {
      console.log(user.userId, socket.userId);
      if (user.userId === socket.userId) {
        console.log(typeof user.timeout);
        if (typeof user.timeout !== 'undefined') {
          console.log(user.name, 'is no longer marked as leaving');
          clearTimeout(user.timeout);
        }
      }
    });
  }

});
