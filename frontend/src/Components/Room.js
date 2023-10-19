import AudioRecorder from './AudioRecorder';
import LateXparser from './LateXparser';
import TextBox from './TextBox';
import '../App.css'
import React from 'react'
import { useParams } from 'react-router-dom';

export default function Room() {
    const {roomid} = useParams();
    console.log(roomid);
    return (
    <div className='main'>
        <AudioRecorder />
        <div className="LHS-container">
            <LateXparser />
        </div>
        <div className="RHS-container">
            <TextBox roomid={roomid}/>
        </div>
    </div>
    )
}
