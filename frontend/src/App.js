// import io from 'socket.io-client';
import './App.css'
import JoinRoom from './Components/JoinRoom';
import { Route,Routes, BrowserRouter } from 'react-router-dom';
import CreateNewRoom from './Components/CreateNewRoom';
import Room from './Components/Room';
// const socket = io("http://localhost:6909/",{transports: ['websocket']});

function App(){
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/join" element={<JoinRoom />} />
          <Route path="/create" element={<CreateNewRoom />} />
          <Route path="/room/:roomid/:username" element={<Room />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
