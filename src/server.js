var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.set('view engine', 'ejs');

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/:hash', function(req, res) {
    res.render(__dirname + '/room.ejs' ,  {data: req.params.hash});
});

io.on('connection', function(socket){
  socket.on('subscribe', function(room) {
    console.log('joining room', room);
    socket.join(room);
  });

  socket.on('send message', function(data) {
    console.log('sending room post', data.room);
    console.log('message', data);
    io.to(data.room).emit('conversation_private', {
        data
    });
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});