var express = require('express');
var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var ejs = require('ejs');
//var session = require('express-session');
var bodyParser = require('body-parser');

function Message(message, sender) {
    this.message = message;
    this.sender = sender;
}

var messageLog = [];

app.set('view engine', 'ejs');

app.use(bodyParser());
//app.use(session({secret: 'gpezoruhgozerhgezhrg'}));

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    res.render('index', { messages: messageLog });
});
/*
app.post('/', function(req, res){
    var messages = new Message(req.body.newMessage, req.body.sender);
    messageLog.push(messages);
    console.log(messageLog);
    //socket.emit('message', req.body.newMessage);
});
*/
io.on('connection', function(socket) {
    console.log('Client connected +1');
    socket.on('newMessage', function(message) {
        if (socket.pseudo == 0) {
            socket.pseudo = 'anonimous';
        }
        socket.broadcast.emit('newMessage', { sender: socket.pseudo, message: message })
    });
    socket.on('pseudo', function(pseudo) {
        socket.pseudo = pseudo;
        socket.broadcast.emit('newUser', pseudo + ' vừa tham gia !');
    })
});

server.listen(process.env.PORT || 3000, function() {
    console.log('app running');
});