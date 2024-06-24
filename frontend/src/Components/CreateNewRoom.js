import React, { useState } from 'react'
import io from 'socket.io-client';
import { v4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
const socket = io(process.env.REACT_APP_BACKEND_URL,{transports: ['websocket']});

const randomUuid = v4();

export default function CreateNewRoom() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [roomid, setRoomid] = useState(randomUuid);
  
    const handleUsernameChange = (e) => {
      setUsername(e.target.value);
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      socket.emit('join-room',{username:username,roomid:roomid});
      navigate(`/room/${roomid}`);
    };

    return (
      <div>
        <h2>Create Room</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={handleUsernameChange}
            />
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    );
}
