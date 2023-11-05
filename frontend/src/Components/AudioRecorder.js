import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import SimplePeer from 'simple-peer';

export default function AudioRecorder({socket,username,roomid}) {
  // const [userList,setUserList] = useState(new Set());
  const audioRef = useRef(null);
  // ref: https://github.com/coding-with-chaim/group-video-final/blob/master/client/src/routes/Room.js
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: false, audio: true }).then(stream => {
        socket.emit('join-room', { username, roomid });

        socket.on('update-room-user-list', (newList) => {
          const userList = new Set(newList);
          const filteredList = new Set([...userList].filter(user => user !== username));

          console.log(filteredList);
  
          filteredList.forEach(async (user) => {
            const peer = createPeer(user,username,stream);
          })
        })

    })
    // whenever someone rejoins, everyone refreshes their connections
  },[]);


  function createPeer(user,sender,stream){
    const peer = new SimplePeer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on('signal', async (data) => {
      // send an "signal" to other peers so that they can accept and send me "returning signal" so that we can complete connection
      await socket.emit('send-signal', { target: user, roomid, signal: data });
      await console.log('signal sent');
    });

    return peer;
  }

  function addPeer(incomingSignal,senderid,stream){
    const peer = new SimplePeer({
      initiator: false,
      trickle: false,
      stream,
    })

    peer.on("signal", signal => {
        socket.emit("returning signal", { signal, senderid })
    })

    peer.signal(incomingSignal);

    return peer;
  }

  return (
    <div>
      <video id="microphone_audio" ref={audioRef} autoPlay />
      {/* <button onClick={startStream}>Start</button> */}
      {/* <button onClick={stopStream}>Stop</button> */}
    </div>
  );
}
