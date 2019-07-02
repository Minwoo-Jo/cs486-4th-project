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
var testRole = ["mafia", "citizen", "citizen"]
var roleList1 = ["mafia", "doctor", "police", "mafia", "citizen", "citizen"]
var roleList2 = ["mafia", "doctor", "police", "mafia", "citizen", "citizen", "citizen"]
var roleList3 = ["mafia", "mafia", "doctor", "police", "police", "mafia", "citizen", "citizen"]
// ROOM STATUS
var lobby = '000000';
var Rooms = [{
    id: lobby,
    players: [],
    state: null,
    in_game_status: null,
    time: 0,
    time_stamp: 0
}]



// ROOM INFORMATION UPDATE
setInterval(() => {
    Rooms.forEach((room) => {
        console.log(room["time"])
        switch (room["state"]) {
            case "wait":
                room["time"]++;
                break;
            case "ready":
                room["time"]++;

                if (room["time"] == room["time_stamp"]) {
                    room["state"] = "playing"
                    room["in_game_status"] = "day"
                    room["time"] = 0;
                    var cursor = Math.floor(Math.random() * room["players"].length);
                    var select_list;
                    switch (room["players"].length) {
                        case 3:
                            select_list = testRole
                            break;

                        case 6:
                            select_list = roleList1
                            break
                        case 7:
                            select_list = roleList2
                            break
                        case 8:
                            select_list = roleList3
                            break
                    }

                    select_list.forEach((role) => {
                        while (room["players"][cursor]["role"] != null) {
                            cursor = Math.floor(Math.random() * room["players"].length);
                        }
                        room["players"][cursor]["role"] = role
                    })


                    io.to(room["id"]).emit('room_info', room)


                }
                break;

            case "playing":
                room["time"]++;

                switch (room["in_game_status"]) {
                    case "day":
                        io.to(room["id"]).emit("time_test", 1);
                        if (room["time"] == 60) {
                            console.log("day --> voting");
                            room["in_game_status"] = "voting";
                            room["time"] = 0;
                            room["time_stamp"] = 20;
                            io.to(room["id"]).emit('room_info', room)
                        }
                        break;
                    case "voting":
                        if (room["time"] == room["time_stamp"]) {
                            console.log("QWEQWEQWEQWEQWEQWEWEQWEQWEQWEQWEQWE")
                            console.log(room["players"])
                            console.log("voting --> night");
                            room["in_game_status"] = "night"
                            room["time"] = 60
                            room["time_stamp"] = "not exist";
                            var player = room["players"][0];
                            var count = 1;
                            room["players"].forEach((player_) => {
                                if (player_["id"] != player["id"])
                                    if (player_["isVoted"] > player["isVoted"]) {
                                        player = player_;
                                        count = 1;
                                    } else if (player_["isVoted"] == player["isVoted"]) {
                                        count = 2;
                                    }
                            })
                            console.log(room["players"])

                            if (count == 1) { player["isAlive"] = false }
                            else console.log("error")
                            console.log(player)
                            console.log(room)


                            room["players"].forEach((player_) => { player_["isVoted"] = 0 })
                            check_game_condition(room);
                            console.log(room)
                            if (room["in_game_status"] == "night")
                                io.to(room["id"]).emit('room_info', room)
                        }
                        break;
                    case "night":
                        io.to(room["id"]).emit("time_test", 1);
                        if (room["time"] == 120) {
                            console.log("night --> day");
                            room["in_game_status"] = "day"
                            room["time"] = 0
                            room["players"].forEach((player) => {
                                if (player["isVoted"] == 1) {
                                    if (Math.random() * 2 > 1)
                                        player["isAlive"] = false
                                }
                                if (player["isVoted"] == 2) {
                                    player["isAlive"] = false
                                }
                                player["message"] = null
                            })

                            check_game_condition(room);


                            if (room["in_game_status"] == "day")
                                io.to(room["id"]).emit('room_info', room);
                        }

                        break;
                    case "mafia_win":
                        console.log("mafia win")
                        if (room["time"] == room["time_stamp"]) {
                            room["time"] = 0
                            room["time_stamp"] = "not exist"
                            room["state"] = "wait"
                            room["in_game_status"] = null
                            io.to(room["id"]).emit('room_info', room);
                        }


                        break;
                    case "citizen_win":
                        console.log("citizen win")
                        if (room["time"] == room["time_stamp"]) {
                            room["time"] = 0
                            room["time_stamp"] = "not exist"
                            room["state"] = "wait"
                            room["in_game_status"] = null
                            io.to(room["id"]).emit('room_info', room);
                        }


                        break;
                    default:
                        break;
                }
                break;
            default:
                break;
        }
        room["players"].forEach((player) => {
            if (player["message_time_stamp"] == room["time"]) {
                console.log(player["message_time_stamp"])
                player["message"] = null;
                player["message_time_stamp"] = "not exist"
                io.to(room["id"]).emit("room_info", room)
            }
        })
    });
}, 1000)

var time_in_rooms = [];


//SOCKET
io.on('connection', (socket) => {
    //USER STATUS
    var user_info = {
        id: socket.id,
        name: null,
        message: null,
        message_time_stamp: "not exist",
        isMaster: false,
        isReady: false,
        isAlive: true,
        vote: true,
        isVoted: 0,
        role: null,    //mafia, police, doctor, citizen
        current_room: lobby
    }

    console.log('#### ' + socket.id + ' connected');
    // SET TIMER

    // SET LOBBY

    console.log("set lobby");
    user_info.current_room = lobby;
    socket.join(lobby);
    join_new_room(Rooms)(user_info.current_room)(user_info);
    //io.to(lobby).emit('update_room_list', Rooms);
    //io.to(lobby).emit('room_info', get_current_room(user_info.current_room))
    console.log(Rooms);

    // SET USER NAME
    socket.on('set_name', (msg) => {
        console.log("TEST");
        update_user_info(user_info)("name")(msg);
    })


    socket.emit('update_user_count', clients.length);

    // JOIN ROOM
    socket.on('join_room', (room_id) => {
        if (user_info.current_room != room_id && get_current_room(room_id)["state"] != "playing") {
            console.log("join room" + room_id);


            var before_room_id = user_info.current_room
            socket.leave(before_room_id);
            //LEAVE BEFORE ROOM 
            leave_before_room(Rooms)(before_room_id)(user_info);
            io.to(before_room_id).emit('room_info', get_current_room(before_room_id))
            user_info.isMaster = false;

            //JOIN NEW ROOM
            user_info.current_room = room_id;
            socket.join(user_info.current_room);

            join_new_room(Rooms)(user_info.current_room)(user_info);
            io.emit('update_room_list', Rooms);
            io.to(user_info.current_room).emit('room_info', get_current_room(user_info.current_room))
            console.log("!@#!@#!@#!@#!@#");
            console.log(Rooms);


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

        //LEAVE BEFORE ROOM
        leave_before_room(Rooms)(user_info.current_room)(user_info);
        user_info.current_room = lobby;
        user_info.isMaster = false;
        //JOIN NEW ROOM 
        Rooms = Rooms.concat({
            id: room_id,
            players: [],
            state: "wait",
            in_game_status: null,
            time: 0,
            time_stamp: "not exist"
        })
        socket.join(room_id);
        user_info.current_room = room_id;
        user_info.isMaster = true;

        join_new_room(Rooms)(user_info.current_room)(user_info);

        io.emit('update_room_list', Rooms);
        socket.emit('room_info', get_current_room(user_info.current_room))
        //console.log(Rooms);

    })

    // DISCONNECT
    socket.on('disconnect', () => {
        console.log('user disconnected');
        leave_before_room(Rooms)(user_info.current_room)(user_info);
        //  clearInterval(timer);
    });



    ////////////////////////////IN GAME API

    ///NEW MESSAGE
    socket.on('new_message', (msg) => {
        console.log(msg);
        update_user_info(user_info)("message")(msg);
        update_user_info(user_info)("message_time_stamp")(get_current_room(user_info.current_room)["time"] + 3);
        io.to(user_info.current_room).emit("room_info", get_current_room(user_info.current_room));
    })
    ///SET READY
    var ready = false;
    socket.on('set_ready', () => {
        if (!ready) {
            update_user_info(user_info)("isReady")(true);
            ready = true;
        }
        else {
            update_user_info(user_info)("isReady")(false);
            ready = false;
        }
        io.to(user_info.current_room).emit("room_info", get_current_room(user_info.current_room))

        //FOR GAME START
        var ready_all = [];
        get_current_room(user_info.current_room)["players"].forEach((x) => ready_all.push(x.isReady))
        if (!ready_all.includes(false) && (ready_all.length == 3 || ready_all.length >= 6)) {
            update_room_info(user_info.current_room)("time_stamp")(get_current_room(user_info.current_room)["time"] + 5);
            update_room_info(user_info.current_room)("state")("ready");
        } else {
            update_room_info(user_info.current_room)("time_stamp")("not exist");
        }
        io.to(user_info.current_room).emit("room_info", get_current_room(user_info.current_room))
    })




    //SEND VOTE
    socket.on('send_vote', (user_id) => {
        // if (user_info["vote"]) {
        //     update_user_info(user_info)("vote")(false);
        //     console.log(user_id)
        //     console.log(get_user_info(user_id)(user_info.current_room))
        if (get_current_room(user_info.current_room)["in_game_status"] == "voting") {
            get_user_info(user_id)(user_info.current_room)["isVoted"]++
            console.log(get_user_info(user_id)(user_info.current_room))
        }
        if ((get_current_room(user_info.current_room)["in_game_status"] == "night")) {
            if (user_info.role == "mafia") {
                get_user_info(user_id)(user_info.current_room)["isVoted"]++
            }
            if (user_info.role == "doctor") {
                get_user_info(user_id)(user_info.current_room)["isVoted"] = get_user_info(user_id)(user_info.current_room)["isVoted"] - 2
            }
            if (user_info.role == "police") {
                socket.emit('check_role', (x) => {
                    if (get_user_info(user_id)["role"] == 'mafia')
                        x = true
                    else
                        x = false

                    return x;

                })
            }
        }

        // }

    })

    /////////IN NIGHT 
    ///////////KILL SOMEONE
    socket.on('kill_player', (user_id) => {
        if (user_info.role == "mafia") {
            update_user_info(get_user_info(user_id)(user_info.current_room))("isVoted")(get_user_info(user_id)(user_info.current_room)["isVoted"] + 1);
        }

    })
    socket.on('save player', (user_id) => {
        if (user_info.role == "doctor") {
            update_user_info(get_user_info(user_id)(user_info.current_room))("isVoted")(get_user_info(user_id)(user_info.current_room)["isVoted"] - 2);
        }
    })

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
        if (room != null)
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
                if (player_index != -1) {
                    player_["isReady"] = false;
                    room.players.splice(player_index, 1)
                }
                if (room.players.length === 0 && room.id != lobby) {
                    var room_index = rooms.findIndex((_) => { return _.id == room.id });
                    rooms.splice(room_index, 1);
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
        console.log(user);
        console.log(key);
        if (user !== undefined)
            if (user[key] !== undefined)
                return (value) => {
                    user[key] = value;
                    var room = Rooms.find((room) => { return room.id == user.current_room })
                    if (room != null) {
                        var player = room["players"].find((player) => { return player.id == user.id });
                        if (player !== undefined)
                            if (player[key] !== undefined) { player[key] = value }
                    }
                }
            else
                return () => { console.log("error in update_user_info") }

    }
}

/////// COMBINE FUNCTION TEST
const combine = (...fns) => {
    return param => fns.reduceRight(
        (result, fn) => (fn(result), param)
    )
}
const update_user_info_by_id = combine(update_user_info, get_user_info)


//////////////////////////////////////
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

check_game_condition = (room) => {
    var current_alive = 0;
    var current_mafia = 0;
    room["players"].forEach((player) => {
        if (player["isAlive"] == true) {
            current_alive++
            if (player["role"] == "mafia") {
                current_mafia++
            }
        }
    })
    if (current_mafia == 0) {
        room["in_game_status"] = "citizen_win"
        room["time"] = 0
        room["time_stamp"] = 60
        io.to(room["id"]).emit("room_info", room)
    }
    else if (current_alive / 2 <= current_mafia) {
        room["in_game_status"] = "mafia_win"
        room["time"] = 0
        room["time_stamp"] = 60
        io.to(room["id"]).emit("room_info", room)
    }
}