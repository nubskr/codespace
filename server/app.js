const express = require('express');
const { createServer } = require('node:http');
const { Server } = require("socket.io");
const cors = require('cors');

const app = express();
app.use(cors());
const server = createServer(app);
const io = new Server(server); // this shit creates a separate websocket server whenever a connection opens

app.get('/', (req, res) => {
    res.send('omg hewwo fren!!');
});

io.on('connection', (socket) => {
    console.log('hmmm');
    socket.on('test', (shit) => {
        console.log(shit);
    })
    socket.on('disconnect', () => {
        // gets triggered whever the connection closes due to any reason
        console.log(':(');
    })
})  

server.listen(6969, () => {
    console.log(`server listening`);
})