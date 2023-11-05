import AudioRecorder from './AudioRecorder';
import LateXparser from './LHS/LateXparser';
import TextBox from './TextBox';
import '../App.css'
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import SideDrawer from './SideDrawer';
import MiniDrawer from './SideDrawer';
import Main_LHS from './LHS/Main_LHS';
// import MenuIcon from '@mui/icons-material/Menu';
// import io from 'socket.io-client';  

// const socket = io("http://localhost:6909/", { transports: ['websocket'] });

export default function Room() {
    const {roomid,username} = useParams();
    // TODO: get the username
    // TODO: we join room here
    return (
    <div className='main'>
        <div className="LHS-container">
            <Main_LHS />
            {/* // <ProblemInputModal /> */}
            {/* <LateXparser /> */}
        </div>
        <div className="RHS-container">
            <TextBox roomid={roomid}/>
        </div>
        <MiniDrawer />
        {/* <MenuIcon /> */}
        {/* <AudioRecorder socket={socket} username={username} roomid={roomid}/> */}
    </div>
    )
}
