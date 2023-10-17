// import io from 'socket.io-client';
import { useRef } from 'react';
import AudioRecorder from './Components/AudioRecorder';
import LateXparser from './Components/LateXparser';
import TextBox from './Components/TextBox';
import './App.css'
// const socket = io("http://localhost:6969/",{transports: ['websocket']});

function App() {
  return (
    <div className='main'>
      <div className="LHS-container">
        <LateXparser />
      </div>
      <div className="RHS-container">
        <TextBox className="RHS-container"/>
      </div>
    </div>
  );
}


export default App;
