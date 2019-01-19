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

var lobby = '000000';

var Rooms = [{
    id: lobby,
    players: [],
    state: null
}]
var time_in_rooms = [];


//SOCKET
io.on('connection', (socket) => {

    var user_info = {
        id: socket.id,
        name: null,
        isMaster: false,
        isReady: false,
        current_room: lobby
    }
    console.log('#### ' + socket.id + ' connected');

    // SET LOBBY
    console.log("set lobby");
    user_info.current_room = lobby;
    socket.join(lobby);
    join_new_room(Rooms)(user_info.current_room)(user_info);

    //io.to(lobby).emit('update_room_list', Rooms);

    io.to(lobby).emit('room_info', Rooms.find(function (room) {
        return room.id == user_info.current_room
    }))


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
            // console.log(Rooms);
            console.log("join room" + room_id);

            //LEAVE BEFORE ROOM
            leave_before_room(Rooms)(user_info.current_room)(user_info);
            var before_room_id = user_info.current_room
            socket.leave(user_info.current_room);
            io.to(user_info.current_room).emit('room_info', Rooms.find(function (room) {
                return room.id == user_info.current_room
            }))

            user_info.isMaster = false;


            //JOIN NEW ROOM
            user_info.current_room = room_id;
            socket.join(user_info.current_room);
            join_new_room(Rooms)(user_info.current_room)(user_info);

            io.emit('update_room_list', Rooms);



            io.to(before_room_id).emit('room_info', Rooms.find(function (room) {
                return room.id == user_info.current_room
            }))


            console.log(Rooms);
        }
    })
    //LEAVE ROOM
    socket.on('leave_room', (room_id) => {

        // console.log(Rooms);
        console.log("leave room" + room_id);
        leave_before_room(Rooms)(user_info.current_room)(user_info);
        io.to(user_info.current_room).emit('room_info', Rooms.find(function (room) {
            return room.id == user_info.current_room
        }))
        socket.leave(user_info.current_room);

        //JOIN LOBBY
        user_info.current_room = lobby;
        user_info.isMaster = false;
        socket.join(lobby);
        join_new_room(Rooms)(user_info.current_room)(user_info);

        io.to(user_info.current_room).emit('room_info', Rooms.find(function (room) {
            return room.id == user_info.current_room
        }))
        console.log(Rooms);
    })
    //CREATE ROOM
    socket.on('create_room', () => {
        var room_id = moment().format("mmss");
        console.log("creat_room");
        console.log(Rooms);

        //LEAVE BEFORE ROOM
        leave_before_room(Rooms)(user_info.current_room)(user_info);
        user_info.current_room = lobby;
        user_info.isMaster = false;

        // console.log("%%%%%%%%%%%%%")
        // console.log(Rooms);

        //JOIN NEW ROOM 
        Rooms = Rooms.concat({
            id: room_id,
            players: [],
            state: "waiting"
        })
        socket.join(room_id);
        user_info.current_room = room_id;
        user_info.isMaster = true;

        join_new_room(Rooms)(user_info.current_room)(user_info);

        io.emit('update_room_list', Rooms);
        socket.emit('room_info', Rooms.find(function (room) {
            return room.id == user_info.current_room
        }))
        //       console.log(Rooms);

    })
    // DISCONNECT
    socket.on('disconnect', () => {
        console.log('user disconnected');
        //       console.log(Rooms);

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

        if (room != null)
            return (player_) => {

                var player_index = room.players.findIndex((player) => {
                    return player.id == player_.id
                })

                if (player_index != -1) {
                    room.players.splice(player_index, 1);

                }

                if (room.players.length == 0 && room.id != lobby) {
                    rooms.splice(rooms.findIndex((_) => {
                        return _.id == room.id
                    }, 1));
                }
                return true;

            }
        else
            return (player_) => console.log("error in leave_before_room")

    }
}

join_new_room = (rooms) => {
    console.log("1");
    console.log(Rooms);
    return (room_id) => {
        console.log("2");
        console.log(Rooms);
        var room = rooms.find((room) => {
            return room.id == room_id
        });
        if (room != null)
            return (player) => {
                console.log("3");
                console.log(Rooms);
                room.players.push(player)

                return true;
            }
        else
            return (player) => console.log("error in join_new_room")


    }

}

update_user_info = (user) => {
    return (key) => {
        if (Object.keys(user).includes(key))
            return (value) => {
                user[key] = value;
                Rooms.find((room) => {
                    return room.id == user.current_room
                }).players.find((player) => {
                    return player.id == user.id
                })[key] = value
            }
        else
            return () => console.log("error in update_user_info")

    }
}
update_room_info = (room_id) => {
    var room = Rooms.find((room) => {
        return room.id == room_id
    })
    if (room != null)
        return (key) => {
            if (Object.keys(room).includes(key) != null)
                return (value) => {
                    room[key] = value;
                }
            else
                return () => console.log("error in update_room_info")
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
//   //  join_new_room(Rooms)(user_info.current_room)(user_info);
//     Rooms.find(function (room) {
//         return room.id == user_info.current_room
//     }).players.push(user_info);
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
//         Rooms.find((room) => {
//             return room.id == user_info.current_room;
//         }).players.splice(Rooms.find((room) => {
//             return room.id == user_info.current_room;
//         }).players.findIndex((user) => {
//             return user.id == user_info.id
//         }), 1);
//       //  leave_before_room(Rooms)(user_info.current_room)(user_info.id);
//         user_info.current_room = lobby;
//         user_info.isMaster = false;
//         //JOIN NEW ROOM
//         user_info.current_room = room_id;
//         socket.join(user_info.current_room);
//       //  join_new_room(Rooms)(user_info.current_room)(user_info);
//         Rooms.find(function (room) {
//             return room.id == room_id
//         }).players.push(user_info);

//         socket.emit('room_info', Rooms.find(function (room) {
//             return room.id = user_info.current_room
//         }))

//     })
//     //LEAVE ROOM
//     socket.on('leave_room', (room_id) => {

//         console.log("leave room" + room_id);
//         //LEAVE BEFORE ROOM
//         Rooms.find((room) => {
//             return room.id == user_info.current_room;
//         }).players.splice(Rooms.find((room) => {
//             return room.id == user_info.current_room;
//         }).players.findIndex((user) => {
//             return user.id == user_info.id
//         }), 1);
//     //    leave_before_room(Rooms)(user_info.current_room)(user_info.id);
//         user_info.current_room = lobby;
//         user_info.isMaster = false;
//         socket.join(lobby);
//       //  join_new_room(Rooms)(user_info.current_room)(user_info);
//         //JOIN LOBBY
//         Rooms.find(function (room) {
//             return room.id == user_info.current_room
//         }).players.push(user_info);
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
//         Rooms.find((room) => {
//             return room.id == user_info.current_room;
//         }).players.splice(Rooms.find((room) => {
//             return room.id == user_info.current_room;
//         }).players.findIndex((user) => {
//             return user.id == user_info.id
//         }), 1);
//        // leave_before_room(Rooms)(user_info.current_room)(user_info.id);
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
//        // join_new_room(Rooms)(user_info.current_room)(user_info);
//         Rooms.find(function (room) {
//             return room.id == room_id
//         }).players.push(user_info);
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
//         Rooms.find((room) => {
//             return room.id == user_info.current_room;
//         }).players.splice(Rooms.find((room) => {
//             return room.id == user_info.current_room;
//         }).players.findIndex((user) => {
//             return user.id == user_info.id
//         }), 1);
//        // leave_before_room(Rooms)(user_info.current_room)(user_info.id);
//         // user_info.current_room = lobby;
//         // user_info.isMaster = false;

//     });
//     ///

//     socket.on('update_room_list', () => {
//         console.log(Rooms);

//         socket.emit('update_room_list', Rooms);
//     })

// });

