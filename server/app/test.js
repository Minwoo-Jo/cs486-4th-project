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

var clients = () => { return io.sockets.clients().connected }

// ROOM STATUS
var lobby = '000000';
var Rooms = [{
    id: lobby,
    players: [],
    state: null,
    time: 0
}]
setInterval(() => {
    Rooms.forEach((room) => {
        if (room["state"] == "start") {
            room["time"]++
        }
    });
}, 1000)

var time_in_rooms = [];


//SOCKET
io.on('connection', (socket) => {
    var user_info = {
        id: socket.id,
        name: null,
        message: null,
        isMaster: false,
        isReady: false,
        isAlive: true,
        vote : true,
        isVoted: 0,
        current_room: lobby
    }

    console.log('#### ' + socket.id + ' connected');
    var time = 0;
    timer = setInterval(() => { socket.emit('time_test', time++) }, 1000)

    // SET LOBBY
    console.log("set lobby");
    user_info.current_room = lobby;
    socket.join(lobby);
    join_new_room(Rooms)(user_info.current_room)(user_info);

    //io.to(lobby).emit('update_room_list', Rooms);

    io.to(lobby).emit('room_info', get_current_room(user_info.current_room))


    console.log(Rooms);
    // SET USER NAME
    socket.on('set_name', (msg) => {
        console.log("TEST");
        update_user_info(user_info)("name")(msg);
    })
    // SET READY
    socket.on('send_ready', () => {
        update_user_info(user_info)("isReady")(true);
    })

    socket.emit('update_user_count', clients.length);
    // JOIN ROOM
    socket.on('join_room', (room_id) => {
        if (user_info.current_room != room_id) {
            console.log("join room" + room_id);
            //LEAVE BEFORE ROOM
            leave_before_room(Rooms)(user_info.current_room)(user_info);
            var before_room_id = user_info.current_room
            socket.leave(user_info.current_room);
            io.to(user_info.current_room).emit('room_info', get_current_room(user_info.current_room))
            user_info.isMaster = false;
            //JOIN NEW ROOM
            user_info.current_room = room_id;
            socket.join(user_info.current_room);
            join_new_room(Rooms)(user_info.current_room)(user_info);
            io.emit('update_room_list', Rooms);
            io.to(before_room_id).emit('room_info', get_current_room(user_info.current_room))
            console.log(Rooms);
        }
    })
    //LEAVE ROOM
    socket.on('leave_room', (room_id) => {

        // console.log(Rooms);
        console.log("leave room" + room_id);
        leave_before_room(Rooms)(user_info.current_room)(user_info);
        io.to(user_info.current_room).emit('room_info', get_current_room(user_info.current_room))
        socket.leave(user_info.current_room);

        //JOIN LOBBY
        user_info.current_room = lobby;
        user_info.isMaster = false;
        socket.join(lobby);
        join_new_room(Rooms)(user_info.current_room)(user_info);
        io.to(user_info.current_room).emit('room_info', get_current_room(user_info.current_room))
        console.log(Rooms);
    })
    //CREATE ROOM
    socket.on('create_room', () => {
        var room_id = moment().format("mmssSS");
        console.log("creat_room");
        console.log(Rooms);

        //LEAVE BEFORE ROOM
        leave_before_room(Rooms)(user_info.current_room)(user_info);
        user_info.current_room = lobby;
        user_info.isMaster = false;
        //JOIN NEW ROOM 
        Rooms = Rooms.concat({
            id: room_id,
            players: [],
            state: "waiting",
            time: 0
        })
        socket.join(room_id);
        user_info.current_room = room_id;
        user_info.isMaster = true;

        join_new_room(Rooms)(user_info.current_room)(user_info);

        io.emit('update_room_list', Rooms);
        socket.emit('room_info', get_current_room(user_info.current_room))
        //       console.log(Rooms);

    })
    // DISCONNECT
    socket.on('disconnect', () => {
        console.log('user disconnected');
        leave_before_room(Rooms)(user_info.current_room)(user_info);
        clearInterval(timer);
    });



    ////////////////////////////IN GAME API

    ///NEW MESSAGE
    socket.on('new_message', (msg) => {
        update_user_info(user_info)("message")(msg);
        io.to(user_info.current_room).emit("room_info", get_current_room(user_info.current_room))
    })
    ///SET READY
    var ready = false;
    socket.on('set_ready', () => {
        if (!ready) {
            update_user_info(user_info)("isReady")(true);
            ready = true;
        }
        else {
            update_user_info(user_info)("isReady")(true);
            ready = false;
        }
        io.to(user_info.current_room).emit("room_info", get_current_room(user_info.current_room))
    })
    //SET VOTE
    socket.on('set_vote', (user_id) => {
        if(user_info.vote){
            update_user_info(user_info)("vote")(false);
            update_user_info(get_user_info(user_id)(user_info.current_room))("isVoted")(get_user_info(user_id)["isVoted"]+1);
        }

    })

    ///

    socket.on('update_room_list', () => {
        console.log(Rooms);
        socket.emit('update_room_list', Rooms);
    })

});

get_current_room = (room_id) => {
    return Rooms.find((room) => { return room.id == room_id })
}

get_user_info = (user_id) => {
    return (room_id) => {
        var room = get_current_room(room_id)
        if (room["players"] !== undefined) {
            return room["players"].find((player) => { return player.id == user_id })
        }
    }
}

leave_before_room = (rooms) => {

    return (room_id) => {
        var room = rooms.find((room) => { return room.id == room_id })

        if (room != null)
            return (player_) => {
                var player_index = room.players.findIndex((player) => { return player.id == player_.id })
                if (player_index != -1) { room.players.splice(player_index, 1) }
                if (room.players.length == 0 && room.id != lobby) {
                    rooms.splice(rooms.findIndex((_) => { return _.id == room.id }, 1));
                }
            }
        else
            return () => console.log("error in leave_before_room")

    }
}

join_new_room = (rooms) => {
    return (room_id) => {
        var room = rooms.find((room) => { return room.id == room_id });
        if (room != null)
            return (player) => {
                if (room.players !== undefined)
                    room.players.push(player)
                console.log(Rooms);
            }
        else
            return () => console.log("error in join_new_room")


    }

}

update_user_info = (user) => {
    return (key) => {
        if (user[key] !== undefined)
            return (value) => {
                user[key] = value;
                var room = Rooms.find((room) => { return room.id == user.current_room })
                if (room["players"] !== undefined) {
                    var player = room["players"].find((player) => { return player.id == user.id });
                    if (player !== undefined)
                        if (player[key] !== undefined) { player[key] = value }
                }
            }
        else
            return () => { console.log("error in update_user_info") }

    }
}
update_room_info = (room_id) => {
    var room = Rooms.find((room) => { return room.id == room_id })
    if (room != null)
        return (key) => {
            if (room[key] !== undefined)
                return (value) => { room[key] = value }
            else
                return () => console.log("error in update_room_info")
        }
}
