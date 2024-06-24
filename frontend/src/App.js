// import io from 'socket.io-client';
import './App.css'
import JoinRoom from './Components/JoinRoom';
import { Route,Routes, BrowserRouter } from 'react-router-dom';
import CreateNewRoom from './Components/CreateNewRoom';
import Room from './Components/Room';
import GetUsername from './Components/GetUsername';

// const socket = io("localhost:6909/",{transports: ['websocket']});

function App(){
  console.log(process.env)
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/join" element={<JoinRoom />} />
          <Route path="/create" element={<CreateNewRoom />} />
          <Route path="/room/:roomid/:userid" element={<Room />} />
          <Route path="/room/:roomid/" element={<GetUsername />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
