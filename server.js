var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

users = [];
connections = [];

server.listen(process.env.PORT || 3000);
console.log('Server running...');

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});



io.sockets.on('connection', function(socket){
	connections.push(socket);
	console.log('Connected: %s sockets connected', connections.length);

    //console.log('b user connected');
	//disconnect 
	socket.on('disconnect',function(data){
	 
	   users.splice(users.indexOf(socket.username), 1);
	   updateUsernames();
	   connections.splice(connections.indexOf(socket), 1);
	   console.log('Disconnected: %s sockets connected', connections.length);
   });

	//send messages
	socket.on('chat message', function(data){
		//console.log('message:'+msg);
		io.emit('chat message', {msg:data,user:socket.username});
	});

	//new user
	socket.on('new user', function(data,callback){
		callback(true);
		socket.username = data;
		users.push(socket.username);
		updateUsernames();
	});

	function updateUsernames(){
		io.sockets.emit('get users', users);
	}
});


	
/*var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});*/
	