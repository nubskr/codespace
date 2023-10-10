const express = require('express');
const { createServer } = require('node:http');
const { Server } = require("socket.io");
const cors = require('cors');
const test = require('./routes/test.js');

const app = express();
app.use(cors());
const server = createServer(app);
const io = new Server(server); // this shit creates a separate websocket server whenever a connection opens

app.get('/', (req, res) => {
    res.send('omg hewwo fren!!');
});

app.use('/test',test);

io.on('connection', (socket) => {
    console.log('omg hi bb');
    
    socket.on('update', (shit) => {
        console.log(shit);
	socket.broadcast.emit('updatee',shit);
    })

    socket.on('send-offer', (shit_offer) => {
        console.log('shit received');
        socket.broadcast.emit('receive-offer',shit_offer);
    })

    socket.on('send-answer', (shit_offer) => {
        console.log('shit ans send');
        socket.broadcast.emit('receive-ans',shit_offer);
    })

    socket.on('send-ice-cand', (shit) => {
        console.log("icceeeeeeee");
        socket.broadcast.emit('receive-ice-cand',shit);
    })

    socket.on('disconnect', () => {
        // gets triggered whever the connection closes due to any reason
        console.log(':(');
    })
})  
// TODO: make voice chat
// just send audio which is recorded through the same socket connection
server.listen(6969, () => {
    console.log(`server listening`);
})
