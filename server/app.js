const express = require('express');
const { createServer } = require('node:http');
const { Server } = require("socket.io");
const cors = require('cors');
const test = require('./routes/test.js');
var bodyParser = require('body-parser')

const app = express();
app.use(cors());
const server = createServer(app);
const io = new Server(server); // this shit creates a separate websocket server whenever a connection opens

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.get('/', (req, res) => {
    res.send('omg hewwo fren!!');
});

app.use('/test',test);

io.on('connection', (socket) => {
    socket.on('join-room',({username,roomid}) => {
        socket.username = username;
        socket.join(roomid);
        console.log(`${username} joined ${roomid}`);
    })

    socket.on('update-code', ({roomid,code}) => {
        socket.broadcast.emit('receive-code-update',code);
        socket.to(roomid).emit('receive-code-update',code);
    })

    socket.on('send-offer', ({roomid,offer}) => {
        socket.to(roomid).emit('receive-offer',offer);
    })

    socket.on('send-answer', ({roomid,ans}) => {
        socket.to(roomid).emit('receive-ans',ans);
    })

    socket.on('send-ice-cand', ({roomid,cand}) => {
        socket.to(roomid).emit('receive-ice-cand',cand);
    })

    socket.on('leave-room', ({roomid}) => {
        socket.leave(roomid);
    })

    socket.on('disconnect', () => {
        // triggered whever a connection closes 
        console.log('a connection closed');
    })
})  

server.listen(6909, () => {
    console.log(`server listening`);
})
