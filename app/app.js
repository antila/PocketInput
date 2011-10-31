
/**
 * Module dependencies.
 */

var express = require('express');

var app = module.exports = express.createServer();
var io = require('socket.io').listen(app);

var jade = require('jade');

var nicknames = {};

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));

});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes
app.get('/', function(req, res){
  res.render('index.jade', {
    header: '#Header#',
    title: 'PocketInput',
    games: 'hej'
  });
});
app.get('/games/:id/assets/:file', function(req, res){
    /*res.render('index.jade', {
    header: '#Header#',
    title: 'PocketInput',
    games: 'hej'
  });*/

  res.sendfile('./games/'+ req.params.id +'/assets/'+ req.params.file, function(err){
  if (err) {
    //next(err);
    console.log(err);
    res.send('404', 404);
  } else {
    //console.log('transferred %s', path);
  }
});
});


io.sockets.on('connection', function (socket) {
  
  socket.on('disconnect', function () {
    delete nicknames[socket.nickname];
    socket.emit('user disconnected');
  });
  
  socket.emit('onConnect');
  socket.on('onConnect', function (data) {
    //console.log(data);
    //console.log(socket);
  });
  
  socket.on('onLogin', function (data) {
    console.log(data);
    console.log(socket);
  });
  
  socket.on('set nickname', function (data, fn) {
      var nick = data.name;
      
        if (!nicknames[nick]) {
            nicknames[socket.id] = socket.nickname = nick;
            socket.set('nickname', data, function () {
                console.log(data);
            });
            console.log('done');
            socket.emit('nickname okay', {name: data.name });
        }
      
 /*     
      
      
    console.log('set nickname');
    socket.set('nickname', data, function () {
      console.log(data);
    });
    console.log('done');
    socket.emit('nickname okay', {name: data.name });
    * */
  });

  socket.on('msg', function (data) {
      var username = '';
      
      socket.get('nickname', function (err, data) {
        console.log(data);
        if (data && data.hasOwnProperty('name')) {          
          username = data.name;
        } else {
          socket.emit('nickname failed');
          return;
        }
      });

      //console.log('Chat message by ', data.name);
      console.log('Chat message ', data.message);
      socket.broadcast.emit('chat', { message: data.message, name: username });
  });
  socket.on('sendInput', function (data) {
      socket.get('nickname', function (err, data) {
        if (data && data.hasOwnProperty('name')) {          
          username = data.name;
        }
      });
      socket.broadcast.emit('playerInput', { input: data.input, nickname: username });
  });

/* SERVER
 */
  socket.on('server start', function (data) {
    console.log('Started server');
    /*socket.set('nickname', data, function () {
      console.log(data);
    });
    console.log('done');*/
    socket.emit('server start okay');
  });
  
  socket.on('startGame', function (data) {
    console.info('\nstartGame: '+data.game);

console.info(nicknames);

    socket.broadcast.emit('goToGame', {game: data.game });
    socket.emit('goToGame', {game: data.game, users: nicknames });
  });
  
  
});

app.listen(80);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
