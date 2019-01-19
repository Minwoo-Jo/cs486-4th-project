import openSocket from 'socket.io-client';
const socket = openSocket("http://143.248.38.120:80");

function subscribeToTimer(cb) {
    socket.on('timer', timestamp => cb(null, timestamp));
    socket.emit('subscribeToTimer', 1000);
}

function subscribeToTimer2(cb) {
    socket.on('timer', timestamp => cb(null, timestamp));
    socket.emit('subscribeToTimer', 1000);
}

function subscribeGame(cb){
    socket.on('reload', chats => cb(null, chats));
    socket.emit('connectServer');
}

function sendMessage(message){
    console.log("send message");
    socket.emit('send message', message);
}

function sendName(message){
    console.log("sendName");
    socket.emit("sendName",message);
}

function getRoomList(cb){
    console.log("getRoomList")
    socket.on('roomlist',rooms=>cb(null,rooms));
}

function callRoomList(){
    socket.emit("callRooms");
}

function enterRoom(message){
    console.log(message);
    socket.emit("enterRoom",message)
}
export { subscribeGame,sendMessage,sendName,getRoomList,callRoomList,enterRoom}