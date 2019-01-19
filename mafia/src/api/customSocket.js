import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:80');
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
    socket.emit('send message', message);
}

export { subscribeGame };
export { sendMessage };
