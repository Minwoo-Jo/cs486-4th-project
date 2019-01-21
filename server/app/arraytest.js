
var Rooms = [{
    id: "test",
    players: [{
        id: "test",
        name: "test",
        isMaster: false,
        current_room: null
    }, {
        id: "test",
        name: "test",
        isMaster: false,
        current_room: null
    }]
}]

var user_info = {
    id: "eyp",
    name: null,
    isMaster: false,
    current_room: null
}
console.log(Rooms)
Rooms.find(function (room) {
    return room.id == "test"
}).players.push(user_info)
console.log(Rooms)

var a = "test"
console.log(a.length)
// Rooms.concat({
//     id: "test2",
//     players: []
// })

var c = (a,b) => {
    return a+b
}

var a = (c) => {
    return (d) => {
        return c+d
    }
}

console.log(a(3)(5))

check = (rooms) => {
    return (room_id) => {
        room_id++
        rooms++
        return (player_id) => {
            return rooms + " " + room_id + " " + player_id
        }
    }
}

console.log(check(1)(2)(3))

var a = {
    id : "test",
    key : true
}

update = (test) => {
    return (key) => {
        return (value) =>{
            test[key]= value
        } 
    }
}
console.log(a.id)
update(a)("id")("YEYP")
console.log(a.id)
console.log(a["d"]==undefined)