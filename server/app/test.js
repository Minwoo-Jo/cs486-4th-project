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

//
// var rooms = () => {
//     var origin = Object.keys(io.sockets.adapter.rooms);
//     var rooms = []
//     origin.forEach((room_id) => {
//         if( room_id > 7 ) {
//             rooms.push(room_id);
//         }
//     })

//     return rooms;
// };
var clients = () => {
    return io.sockets.clients().connected;
}
var players = [];
var lobby = '000000';

var Rooms = [{
    id: lobby,
    players: [],
    state: null
}]


//SOCKET
io.on('connection', (socket) => {
    var user_info = {
        id: socket.id,
        name: null,
        isMaster: false,
        current_room: null
    }
    console.log('#### ' + socket.id + ' connected');

    // SET LOBBY
    console.log("set lobby");
    user_info.current_room = lobby;
    socket.join(lobby);
    join_new_room(Rooms)(user_info.current_room)(user_info);
    // Rooms.find(function (room) {
    //     return room.id == user_info.current_room
    // }).players.push(user_info);
    socket.emit('room_info', Rooms.find(function (room) {
        return room.id = user_info.current_room
    }))
    console.log(Rooms.find(function (room) {
        return room.id == user_info.current_room
    }));
    // SET USER NAME
    socket.on('set_name', (msg) => {
        user_info.name = msg;
    })

    socket.emit('update_user_count', clients.length);
    // JOIN ROOM
    socket.on('join_room', (room_id) => {
        console.log("join room" + room_id);

        //LEAVE BEFORE ROOM
   
        leave_before_room(Rooms)(user_info.current_room)(user_info);
        user_info.isMaster = false;
        //JOIN NEW ROOM
        user_info.current_room = room_id;
        socket.join(user_info.current_room);

        join_new_room(Rooms)(user_info.current_room)(user_info);

        socket.emit('room_info', Rooms.find(function (room) {
            return room.id = user_info.current_room
        }))

        socket.emit('update_room_list', Rooms);
        console.log(Rooms);
    })
    //LEAVE ROOM
    socket.on('leave_room', (room_id) => {

        console.log("leave room" + room_id);
  
        leave_before_room(Rooms)(user_info.current_room)(user_info);
        user_info.current_room = lobby;
        user_info.isMaster = false;
        socket.join(lobby);
        join_new_room(Rooms)(user_info.current_room)(user_info);
    
        socket.emit('room_info', Rooms.find(function (room) {
            return room.id = user_info.current_room
        }))
    })
    //CREATE ROOM
    socket.on('create_room', () => {
        console.log("creat_room");
        console.log(Rooms);
        var room_id = moment().format("mmss");

        //LEAVE BEFORE ROOM
        leave_before_room(Rooms)(user_info.current_room)(user_info);
        user_info.current_room = lobby;
        user_info.isMaster = false;

        //JOIN NEW ROOM
        socket.join(room_id);
        user_info.current_room = room_id;
        user_info.isMaster = true;
        Rooms = Rooms.concat({
            id: room_id,
            players: [],
            state: "waiting"
        })
        console.log(Rooms)
        join_new_room(Rooms)(user_info.current_room)(user_info);
        console.log(Rooms)
        socket.emit('update_room_list', Rooms);
        socket.emit('room_info', Rooms.find(function (room) {
            return room.id = user_info.current_room
        }))

    })
    // DISCONNECT
    socket.on('disconnect', () => {
        console.log('user disconnected');
        console.log(user_info.current_room);
        console.log(Rooms);

        leave_before_room(Rooms)(user_info.current_room)(user_info);

    });
    ///

    socket.on('update_room_list', () => {
        console.log(Rooms);

        socket.emit('update_room_list', Rooms);
    })

});

leave_before_room = (rooms) => {
    return (room_id) => {
        var room = rooms.find((room) => {
            return room.id == room_id
        })
        if ( room != null)
            return (player_) => {
                var player_index = room.players.findIndex((player) => {
                    return player.id == player_.id
                })
                console.log("!!!!!!!");
                if (player_index != -1){
                    room.players.splice(player_index, 1);
                    console.log(player_index);
                }
                 
                // if(room.players==[]&&room.id!=lobby){
                //     rooms.splice(rooms.findIndex(room),1);
                // }
                return true;
                
            }
            else
                return (player_) => null;

    }
}

join_new_room = (rooms) => {
    return (room_id) => {
        var room = rooms.find((room) => {
            return room.id == room_id
        });
        if (room != null)
            return (player) => {
                room.players.push(player)
                return true;
            }
            else
                return (player) => null;
    }
}



// //SOCKET
// io.on('connection', (socket) => {
//     var user_info = {
//         id: socket.id,
//         name: null,
//         isMaster: false,
//         current_room: null
//     }
//     console.log('#### ' + socket.id + ' connected');

//     // SET LOBBY
//     console.log("set lobby");
//     user_info.current_room = lobby;
//     socket.join(lobby);
//     join_new_room(Rooms)(user_info.current_room)(user_info);
//     // Rooms.find(function (room) {
//     //     return room.id == user_info.current_room
//     // }).players.push(user_info);
//     socket.emit('room_info', Rooms.find(function (room) {
//         return room.id = user_info.current_room
//     }))
//     console.log(Rooms.find(function (room) {
//         return room.id == user_info.current_room
//     }));
//     // SET USER NAME
//     socket.on('set_name', (msg) => {
//         user_info.name = msg;
//     })

//     socket.emit('update_user_count', clients.length);
//     // JOIN ROOM
//     socket.on('join_room', (room_id) => {
//         console.log("join room" + room_id);

//         //LEAVE BEFORE ROOM
//         // Rooms.find((room) => {
//         //     return room.id == user_info.current_room;
//         // }).players.splice(Rooms.find((room) => {
//         //     return room.id == user_info.current_room;
//         // }).players.findIndex((user) => {
//         //     return user.id == user_info.id
//         // }), 1);
//         leave_before_room(Rooms)(user_info.current_room)(user_info.id);
//         user_info.current_room = lobby;
//         user_info.isMaster = false;
//         //JOIN NEW ROOM
//         user_info.current_room = room_id;
//         socket.join(user_info.current_room);
//         join_new_room(Rooms)(user_info.current_room)(user_info);
//         // Rooms.find(function (room) {
//         //     return room.id == room_id
//         // }).players.push(user_info);

//         socket.emit('room_info', Rooms.find(function (room) {
//             return room.id = user_info.current_room
//         }))

//     })
//     //LEAVE ROOM
//     socket.on('leave_room', (room_id) => {

//         console.log("leave room" + room_id);
//         //LEAVE BEFORE ROOM
//         // Rooms.find((room) => {
//         //     return room.id == user_info.current_room;
//         // }).players.splice(Rooms.find((room) => {
//         //     return room.id == user_info.current_room;
//         // }).players.findIndex((user) => {
//         //     return user.id == user_info.id
//         // }), 1);
//         leave_before_room(Rooms)(user_info.current_room)(user_info.id);
//         user_info.current_room = lobby;
//         user_info.isMaster = false;
//         socket.join(lobby);
//         join_new_room(Rooms)(user_info.current_room)(user_info);
//         //JOIN LOBBY
//         // Rooms.find(function (room) {
//         //     return room.id == user_info.current_room
//         // }).players.push(user_info);
//         socket.emit('room_info', Rooms.find(function (room) {
//             return room.id = user_info.current_room
//         }))
//     })
//     //CREATE ROOM
//     socket.on('create_room', () => {
//         console.log("creat_room");
//         console.log(Rooms);
//         var room_id = moment().format("mmss");

//         //LEAVE BEFORE ROOM
//         // Rooms.find((room) => {
//         //     return room.id == user_info.current_room;
//         // }).players.splice(Rooms.find((room) => {
//         //     return room.id == user_info.current_room;
//         // }).players.findIndex((user) => {
//         //     return user.id == user_info.id
//         // }), 1);
//         leave_before_room(Rooms)(user_info.current_room)(user_info.id);
//         user_info.current_room = lobby;
//         user_info.isMaster = false;

//         //JOIN NEW ROOM
//         socket.join(room_id);
//         user_info.current_room = room_id;
//         user_info.isMaster = true;
//         Rooms.push({
//             id: room_id,
//             players: [],
//             state: "waiting"
//         })
//         join_new_room(Rooms)(user_info.current_room)(user_info);
//         // Rooms.find(function (room) {
//         //     return room.id == room_id
//         // }).players.push(user_info);
//         socket.emit('update_room_list', Rooms);
//         socket.emit('room_info', Rooms.find(function (room) {
//             return room.id = user_info.current_room
//         }))

//     })
//     // DISCONNECT
//     socket.on('disconnect', () => {
//         console.log('user disconnected');
//         console.log(user_info.current_room);
//         console.log(Rooms);
//         // console.log( Rooms.find((room_id) => {
//         //     return room_id == user_info.current_room;
//         // }));
//         // //LEAVE ROOM
//         //LEAVE BEFORE ROOM
//         // Rooms.find((room) => {
//         //     return room.id == user_info.current_room;
//         // }).players.splice(Rooms.find((room) => {
//         //     return room.id == user_info.current_room;
//         // }).players.findIndex((user) => {
//         //     return user.id == user_info.id
//         // }), 1);
//         leave_before_room(Rooms)(user_info.current_room)(user_info.id);
//         // user_info.current_room = lobby;
//         // user_info.isMaster = false;

//     });
//     ///

//     socket.on('update_room_list', () => {
//         console.log(Rooms);

//         socket.emit('update_room_list', Rooms);
//     })

// });

