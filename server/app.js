const express = require('express');
const { createServer } = require('node:http');
const { Server } = require("socket.io");
const cors = require('cors');
var bodyParser = require('body-parser');

const app = express();
app.use(cors());
const server = createServer(app);
const io = new Server(server); // this shit creates a separate websocket server whenever a connection opens

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.get('/', (req, res) => {
    res.send('omg hewwo fren!!');
});

const rooms = {};
const username_to_socket = {};
const pairSet = new Map();

// Function to add a pair to the set
function addPair(key, value) {
  pairSet.set(key, value);
}

// Function to check if a pair exists in the set
function pairExists(key, value) {
  return pairSet.get(key) === value;
}

function removeuserfrompair(){
    // pairSet.clear();
}

function getUsersInRoom(roomid) {
    if (rooms[roomid]) {
      return rooms[roomid];
    } else {
      return [];
    }
}

io.on('connection', (socket) => {
    socket.emit('welcome',{msg: 'welcome to room'});
    socket.on('join room',(payload) => {
        socket.roomid = payload.roomid;
        socket.userid = payload.userid;
        
        socket.join(payload.roomid);
        username_to_socket[payload.userid] = socket;

        if (!rooms[payload.roomid]) {
            rooms[payload.roomid] = [];
        }
      
        rooms[payload.roomid].push(payload.userid);
      
        console.log(`${payload.userid} joined ${payload.roomid}`)
        // console.log(`the user socket id is: ${socket.id}`);
        const usersInRoom = getUsersInRoom(payload.roomid);
        io.to(socket.roomid).emit('all users',{users: usersInRoom});
    })
    

    socket.on('send-message', (payload) => {
        io.to(socket.roomid).emit('receive message',{msg: payload.msg});
    })

    socket.on('sending offer', (payload) => {
        // if a has already sent to b, then don't sent from b to a
        if(!pairExists(payload.userToSignal,payload.callerID) && !pairExists(payload.callerID,payload.userToSignal)){
            addPair(payload.userToSignal,payload.callerID);
            console.log(`sending offer to ${payload.userToSignal} from ${payload.callerID}`);
            const targetSocket = username_to_socket[payload.userToSignal];
            // console.log(`target socket id is ${targetSocket.id}`);
            io.to(targetSocket.id).emit('offer received', { signal: payload.signal, callerID: payload.callerID});
        }
        // io.to(socket.roomid).emit('receive message',{msg: payload.msg});
    })

    socket.on('sending reply', (payload) => {
        const targetSocket = username_to_socket[payload.callerID];
        console.log('sending reply');
        // console.log(`userid is: ${[payload.userid]}`);
        // console.log(`callerID is: ${[payload.callerID]}`);
        // console.log(`sending to: ${payload.callerID}`);
        if(targetSocket){
            io.to(targetSocket.id).emit('reply received', { signal: payload.signal, id: payload.userid});
        }
        else{
            console.log('nigger doesnt exist');
        }
    })

    socket.on('private message', (payload) => {
        const targetSocket = username_to_socket[payload.target];
        if (targetSocket) {
            targetSocket.emit('receive message', { msg: payload.msg });
        }
        else{
            console.log('you messed something up nigger');
        }
    })

    socket.on('get-users-in-room', (payload) => {
        const usersInRoom = getUsersInRoom(payload.roomid);
        socket.emit('users-in-room', { users: usersInRoom });
    });
    

    socket.on('disconnect', () => {
        if (socket.roomid && rooms[socket.roomid]) {
          // Remove the user from the room when they disconnect.
          const index = rooms[socket.roomid].indexOf(socket.userid);
          if (index !== -1) {
            rooms[socket.roomid].splice(index, 1);
          }
          console.log(`${socket.userid} left ${socket.roomid}`);
        }
        removeuserfrompair();
    });
    
})  

server.listen(6909, () => {
    console.log(`server listening`);
})
