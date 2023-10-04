// import io from 'socket.io-client';
import TextBox from './Components/TextBox';
// const socket = io("http://localhost:6969/",{transports: ['websocket']});

function App() {
  // socket.emit('test','test message');
  return (
    <div>
      <TextBox />
    </div>
  );
}

export default App;
