import io from 'socket.io-client';
const socket = io("http://localhost:6969/",{transports: ['websocket']});

function App() {
  console.log('fired');
  socket.emit('test','test message');
  return (
    <div>
      hey there
    </div>
  );
}

export default App;
