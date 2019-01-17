module.exports = function (io, Move) {

    io.on('connection', (socket) => {
        console.log('a user connected');

        socket.on('chat massage', (Move) => {
            io.emit('chat massage', Move.Move.id);
        });

        socket.on('disconnect', () => {
            console.log('user disconnected');
        });

        socket.on('move event', (msg) => {
            io.emit('move event', msg);
        })

    });
}