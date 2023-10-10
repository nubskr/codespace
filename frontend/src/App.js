// import io from 'socket.io-client';
import AudioRecorder from './Components/AudioRecorder';
import TextBox from './Components/TextBox';
// const socket = io("http://localhost:6969/",{transports: ['websocket']});

function App() {
  return (
    <div>
      <TextBox />
      <AudioRecorder />
    </div>
  );
}

export default App;
