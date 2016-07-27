var express = require('express');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var app = express();

var connectedUsers=[];
var userId=0;
//var messages=[];
io.sockets.on('connection', function (socket) {
var user = "";

	socket.on('logged', function(utilisateur) {
		user = utilisateur;
		user.tchatId = userId;
		user.tchatControl = 1;
		user.socketId = socket.id;
		connectedUsers[userId] = user;
		userId++;
		console.log("User connected: " + user.username);
		io.sockets.emit("gestionUsers", connectedUsers);
	});

	socket.on('ahiva', function(message, user, currentTchat) { 
		var texto = message;
		var currentUser = user;
		var destination = currentTchat;
		io.sockets.emit("gestionMessages", texto, currentUser, destination);
	});

	socket.on('paustedes', function(message, user) { 
		var texto = message;
		var currentUser = user;
		io.sockets.emit("gestionMessagesGroup", texto, currentUser);
	});

	socket.on('disconnect', function(){
		if (user!=undefined) {
		user.tchatControl = 0;
		console.log('User disconnected: '+ user.username);
		io.sockets.emit("gestionUsers", connectedUsers);
		}
	});
});

http.listen(3000, function () {
  console.log('Exemple app listening on port 3000!');
});