
/**
 * Module dependencies.
 */

var express = require('express');

var app = module.exports = express.createServer();
var io = require('socket.io').listen(app);

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
  res.render('index', {
    title: 'Websockets playground'
  });
});

io.sockets.on('connection', function (socket) {
  
  socket.on('disconnect', function () {
    socket.emit('user disconnected');
  });
  
  socket.emit('onConnect', { hello: 'socket' });
  socket.on('onConnect', function (data) {
    console.log(data);
    console.log(socket);
  });
  
  socket.on('onLogin', function (data) {
    console.log(data);
    console.log(socket);
  });
  
  socket.on('set nickname', function (data) {
    console.log('set nickname');
    socket.set('nickname', data, function () {
      console.log(data);
    });
    console.log('done');
    socket.emit('nickname okay', {name: data.name });
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

  
  
});

app.listen(8800);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
