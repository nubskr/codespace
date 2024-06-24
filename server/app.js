const express = require('express');
const { createServer } = require('node:http');
const { Server } = require("socket.io");
const cors = require('cors');
var bodyParser = require('body-parser');
const test = require("./routes/test")
const submit = require("./routes/submit")
const api1 = require("./routes/api")
const rateLimit = require('express-rate-limit');

const app = express();

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 50, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
})

app.use('/api',limiter);

app.use(rateLimit({
    windowMs: 15 * 60 * 100,
    limit: 1000, // a bit generous here
}))

app.use(cors());
const server = createServer(app);
const io = new Server(server); // this shit creates a separate websocket server whenever a connection opens

app.use(express.json({limit: '50mb'}));
app.use(express.json({limit: '50mb' , extended: true}));

app.use('/api',api1)
app.use('/test',test)
app.use('/submit',submit)

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
    
    socket.on('update-code', (payload) => {
        io.to(socket.roomid).emit('receive-code-update',{code: payload.code});
    });

    socket.on('update-problem-statement', (payload) => {
        io.to(socket.roomid).emit('receive-problem-statement',{statement: payload.statement});
    });

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
            console.log('cutie doesnt exist');
        }
    })

    socket.on('private message', (payload) => {
        const targetSocket = username_to_socket[payload.target];
        if (targetSocket) {
            targetSocket.emit('receive message', { msg: payload.msg });
        }
        else{
            console.log('you messed something up cutie');
        }
    })

    socket.on('get-users-in-room', (payload) => {
        const usersInRoom = getUsersInRoom(socket.roomid);
        console.log('someone is asking around');
        socket.emit('users-in-room', { users: usersInRoom });
    });


    socket.on('disconnect', () => {
        // this is trash bruh
        if (socket.roomid && rooms[socket.roomid]) {
          // Remove the user from the room when they disconnect.
          const index = rooms[socket.roomid].indexOf(socket.userid);

          if (index !== -1) {
            rooms[socket.roomid].splice(index, 1);
          }
          const usersInRoom = getUsersInRoom(socket.roomid);
          io.to(socket.roomid).emit('users-in-room', { users: usersInRoom });

          console.log('users currently in room are: ' + usersInRoom);
          
          console.log(`${socket.userid} left ${socket.roomid}`);
        }
        removeuserfrompair();
    });
    
})  
app.use((req, res, next) => {
    res.status(429).json({
      error: "Rate limit exceeded, please try again later",
    });
  });

server.listen(6909, () => {
    console.log(`server listening`);
})
