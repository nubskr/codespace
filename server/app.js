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

const roomUsers = new Map();

function getSocketByUsernameInRoom(username, roomId) {
    // Find the socket by username in the specified room
    const socketsInRoom = io.sockets.adapter.rooms.get(roomId);
    if (socketsInRoom) {
      for (const socketId of socketsInRoom) {
        const socket = io.sockets.sockets.get(socketId);
        if (socket.username === username) {
          return socket;
        }
      }
    }
    return null;
}

io.on('connection', (socket) => {
    socket.on('join-room', ({ username, roomid }) => {
        socket.roomid = roomid;
        socket.username = username;
        socket.join(roomid);
        console.log(`${username} joined ${roomid}`);
        let usersList = roomUsers.get(roomid);
      
        if (!usersList) {
          usersList = new Set();
        }
      
        usersList.add(username);
        roomUsers.set(roomid, usersList);
        
        // Send the updated user list as an array (Array.from) to the frontend
        console.log(usersList);
        io.to(roomid).emit('update-room-user-list', Array.from(usersList));
        // socket.broadcast.emit('update-room-user-list', Array.from(usersList));
    });
    
    socket.on('send-signal', (data) => {
        // Forward the signal to the target user
        const targetSocket = getSocketByUsernameInRoom(data.target, socket.roomid);
        if (targetSocket) {
            // console.log(targetSocket);
            targetSocket.emit('knock-knock', { source: socket.username, signal: data.signal });
        }
    });

    socket.on('update-code', ({roomid,code}) => {
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

    socket.on('disconnect', () => {
        // triggered whever a connection closes
        const roomid = socket.roomid;
        const username = socket.username;
        let usersList = roomUsers.get(roomid);
        if(usersList){
            usersList.delete(username);
            roomUsers.set(roomid,usersList);
            // send updated list whenever someone leaves
            socket.to(roomid).emit('update-room-user-list', Array.from(usersList));
            socket.leave(roomid);
        }
        console.log('a connection closed');
    })
})  

server.listen(6909, () => {
    console.log(`server listening`);
})
