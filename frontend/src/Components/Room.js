import AudioRecorder from './AudioRecorder';
import LateXparser from './LateXparser';
import TextBox from './TextBox';
import '../App.css'
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import io from 'socket.io-client';  

const socket = io("http://localhost:6909/", { transports: ['websocket'] });

export default function Room() {
    const {roomid,username} = useParams();
    // TODO: get the username
    useEffect(() => {
        socket.emit('join-room', { username, roomid });
        console.log('joined room');
        socket.on('update-room-user-list', (newList) => {
          console.log('run');                                                                         
        });
      },[]);
    return (
    <div className='main'>
        <div className="LHS-container">
            <LateXparser />
        </div>
        <div className="RHS-container">
            <TextBox roomid={roomid} socket={socket}/>
        </div>
        <AudioRecorder socket={socket} username={username} roomid={roomid}/>
    </div>
    )
}
