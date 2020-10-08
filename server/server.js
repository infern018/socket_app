const express = require("express");

var app = express();
var http = require('http').createServer(app);
var path = require('path');
var io = require('socket.io')(http);

const publicPath = path.join(__dirname,"/../public");
const port = process.env.PORT || 3000


app.use(express.static(publicPath));

io.on("connection", (socket) => {
    console.log("a user is connected");

    socket.emit('newMessage', {
        from:"Admin",
        text:"Welcome to the room",
        createdAt : new Date().getTime()
    });

    socket.broadcast.emit('newMessage', {
        from:"Admin",
        text:"A new user has joined",
        createdAt : new Date().getTime()
    });

    

    socket.on('createMessage',(message) => {
        io.emit('newMessage', {
            from:message.from,
            text: message.text,
            createdAt : new Date().getTime()
        })
    });

    socket.on('disconnect', () => {
        console.log('a user disconnected');
    });
})

http.listen(port, ()=> {
    console.log("server is running on port " + port);
});
