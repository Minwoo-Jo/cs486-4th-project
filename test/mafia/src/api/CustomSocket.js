import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:80');

function subscribeGame(cb){
    socket.on('reload', chats => cb(null, chats));
    
}
function sendMessage(message){
    socket.emit('send message', message);
}

function subscribeRoom(cb){
    socket.on('roomlist', rooms => cb(null, rooms));
}
function callRoomList(){
    socket.emit('callRooms');
}
function getId() {
    return socket.id
}


export { subscribeGame };
export { sendMessage };
export { subscribeRoom };
export { callRoomList };