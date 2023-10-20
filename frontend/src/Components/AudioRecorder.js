import React, { useEffect, useRef, useState } from 'react';
// import io from 'socket.io-client';
import SimplePeer from 'simple-peer';
const configuration = { iceServers: [{ urls: "stun:stun.schlund.de:3478" }] };
const peerConnection = new RTCPeerConnection(configuration);
// const socket = io("http://localhost:6909/", { transports: ['websocket'] });

export default function AudioRecorder({socket,username,roomid}) {
  const [userList,setUserList] = useState(new Set());

  // useEffect(() => {
  //   socket.emit('join-room', { username, roomid });
  //   console.log('joined room');
  //   socket.on('update-room-user-list', (newList) => {
  //     console.log('run');                                                                         
  //   });
  // },[]);

  const audioRef = useRef(null);
  async function startStream(userList){
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

      const filteredList = new Set([...userList].filter(user => user !== username));
      console.log(filteredList);
      filteredList.forEach(async (user) => {
        // const peer = new SimplePeer({ initiator: true, stream });

        // peer.on('signal', async (data) => {
        //   await socket.emit('signal', { target: user, roomid, signal: data });
        // });

        // peer.on('stream', (userStream) => {
        //   audioRef.current.srcObject = userStream;
        //   // Handle the remote user's video stream
        // });
      });
    } catch (error) {
      console.error('Error accessing media devices:', error);
    }
  };
  return (
    <div>
      <video id="microphone_audio" ref={audioRef} autoPlay />
      {/* <button onClick={startStream}>Start</button> */}
      {/* <button onClick={stopStream}>Stop</button> */}
    </div>
  );
}
