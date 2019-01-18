var moment = require('moment');
// SERVER , SOCKET
const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
server.listen(80, () => {
    console.log('Connected at 80');
});
// JSON
var bodyParser = require('body-parser');
app.use(bodyParser.json());
// // MONGO DB
// var mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost:27017/local', { useNewUrlParser: true });

// ROOM STATUS
var rooms = () => {
    return io.sockets.adapter.rooms;
};
var clients = () => {
    return io.sockets.clients().connected;
}

var players = [];
var lobby = '000000';
//SOCKET
io.on('connection', (socket) => {
    console.log('a user connected');
    var User = {
        name: String,
        id: String
    }
    socket.emit('reload', players);
    players = players.concat([{id:socket.id, message:"test"}]);
    console.log(players);
    socket.emit('get userlist', players);
    socket.join(lobby);
    socket.on('enter lobby', (msg) => {
        User.name = msg;
        User.id = socket.id;
        socket.join(current_room_id);
        socket.emit('reload', rooms);
    })
    socket.on('create room', () => {
        var room_id = moment().format("mmss");
        socket.join(room_id);
        io.to(lobby).emit('reload lobby', rooms);
    })
    socket.on('enter room', (msg) => {
        socket.join(msg);
        io.to(lobby).emit('reload lobby', rooms);
    })
    socket.on('exit room', () => {
        socket.join(lobby);
        io.to(lobby).emit('reload lobby', rooms);
    })

    socket.on('disconnect', () => {
        console.log('user disconnected');
        players.splice(players.findIndex(function(player){
            return player.id==socket.id
        }),1);
        console.log(players);
    });

    socket.on('clicked', (msg) => {
        console.log("yep" + msg);
        if (msg == "plus")
            io.emit('change', {
                id: socket.id,
                key: msg
            });
        if (msg == "minus")
            io.emit('change', {
                id: socket.id,
                key: msg
            });
    })
    socket.on('playermove', (msg) => {
        console.log("msg");
        io.emit('handlemove', {
            id: socket.id,
            value: msg
        });
    })

    socket.on('button', (msg) => {
        console.log(msg);
        io.emit('button', {
            id: socket.id,
            key: "button"
        });
    })
    socket.on('callplayers', (msg) => {
        var list = Object.keys(clients());
        console.log(list);
        console.log(rooms());
      
        // console.log(Object.keys(rooms));
        // io.emit('getplayers', list)
    })
    socket.on('add name', (msg)=> {
        console.log(msg);
        socket.emit('get names', msg+"!!!!");
    })
    socket.on('send message', (msg) => {
        players.find(function(e){
            return e.id == socket.id
        }).message = msg;
        io.emit('reload', players);
        console.log(players);
    })

});
