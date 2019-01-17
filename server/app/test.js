const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('clicked', (msg) => {
        console.log("yep" + msg);
        if (msg == "plus")
            io.emit('change', "plus");
        if (msg == "minus")
            io.emit('change', "minus");
    })

    socket.on('key', (msg) => {
        switch (msg) {
            case 37:
                io.emit('key', { top: 0, left: -1, dir: LEFT });
                break;
            case 38:
                io.emit('key', { top: -1, left: 0, dir: UP });
                break;
            case 39:
                io.emit('key', { top: 0, left: 1, dir: RIGHT });
                break;
            case 40:
                io.emit('key', { top: 1, left: 0, dir: DOWN });
                break;
            default:
                return;
        }
    })



});

server.listen(80, () => {
    console.log('Connected at 80');

});
