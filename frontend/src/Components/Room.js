import TextBox from './TextBox';
import '../App.css'
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { useState , useRef } from 'react';
import MiniDrawer from './SideDrawer';
import Split from 'react-split';
import Main_LHS from './LHS/Main_LHS';
import io from 'socket.io-client';  
import SimplePeer from 'simple-peer';

import styled from "styled-components";



const Container = styled.div`
    padding: 20px;
    display: flex;
    height: 100vh;
    width: 90%;
    margin: auto;
    flex-wrap: wrap;
`;

const StyledVideo = styled.video`
    height: 40%;
    width: 50%;
`;

const Video = (props) => {
  const ref = useRef();

  useEffect(() => {
      props.peer.on("stream", stream => {
          ref.current.srcObject = stream;
      })
  }, []);

  return (
      <StyledVideo playsInline autoPlay ref={ref} />
  );
}

const videoConstraints = {
  height: window.innerHeight / 2,
  width: window.innerWidth / 2
};


export default function Room() {
    const {roomid,userid} = useParams();
    console.log(`roomid is: ${roomid}`);
    console.log(`userid is: ${userid}`);
    const [peers,setPeers] = useState([]);
    const [isMicOn, setIsMicOn] = useState(true);
    const [currentProbId,setCurrentProb] = useState(null);
    const [members_in_room,setMembersInRoom] = useState([userid]);
    const userVideo = useRef();
    const socketRef = useRef();
    const peersRef = useRef([]);
    // TODO: get the username
    // TODO: we join room here
    
    const toggleMic = () => {
      console.log("hey man!");
      turnonmic();
        // setIsMicOn(!isMicOn);
        // doesnt work for some reason, but we'll figure it out
    };
    

    useEffect(()=>{
      // socketRef.current = io("localhost:6909/", { transports: ['websocket'] });
      // socketRef.current.emit('join room',{roomid: roomid , userid: userid});
    },[])

    function turnonmic(){
        let audioStream = null;
        // socketRef.current = io("localhost:6909/", { transports: ['websocket'] });
        navigator.mediaDevices.getUserMedia({video: false, audio: true}).then(stream => {
            audioStream = stream;
            if(!isMicOn){
                // stream.getAudioTracks().forEach((track) => {
                //     track.enabled = false; // Mute the audio track
                //   });
                const audioTracks = stream.getAudioTracks();
                console.log('I think the foot is going to the breaks');
    if (audioTracks.length > 0) {
      audioTracks[0].stop();
      console.log('breaks applied');
    }
            }
          // socketRef.current.emit('join room',{roomid: roomid , userid: userid});
          socketRef.current = io(process.env.REACT_APP_BACKEND_URL, { transports: ['websocket'] });
      socketRef.current.emit('join room',{roomid: roomid , userid: userid});
          socketRef.current.on('receive message',(payload) => {
            console.log(`I am ${userid}`);
            console.log(payload.msg);
          })
    
          socketRef.current.on('all users',(payload) => {
            const peers = [];
            const tmp = payload.users;
            console.log(tmp);
            tmp.forEach((user) => {
              if(user !== userid){
                const peer = createPeer(user,userid,stream); // {target,my id,stream}
                peersRef.current.push({
                  peerID: user,
                  peer,
                })
                peers.push(peer);
              }
            })
            setPeers(peers);
            socketRef.current.emit('get-users-in-room');
          })
    
          socketRef.current.on('offer received', (payload) => {
            console.log('offer received');
            console.log(`callerid received with offer is: ${payload.callerID}`);
            const peer = addPeer(payload.signal,payload.callerID,stream) // {signal,senderid,stream}
            peersRef.current.push({
              peerID: payload.callerID,
              peer,
            })
    
            setPeers(users => [...users, peer]);
          })
    
          socketRef.current.on('reply received', (payload) => {
            // whatever this step is
            console.log('flag received, end!');
            const item = peersRef.current.find(p => p.peerID === payload.id);
            console.log(peersRef);
            if(!item){
              console.log("item shit not found");
            }
    
            item.peer.signal(payload.signal);
          })

          socketRef.current.on('users-in-room',(payload) => {
            console.log('users in room are ' + payload.users);
            setMembersInRoom(payload.users);
          })
    
        })
      }

    function createPeer(userToSignal, callerID, stream) {
        const peer = new SimplePeer({
          initiator: true,
          trickle: false,
          stream,
        });
    
        peer.on("signal", signal => {
          console.log(`sending offer to ${userToSignal} from ${callerID}`); // callerID is fine here
          socketRef.current.emit("sending offer", { userToSignal, callerID, signal });
        })
    
        return peer;
      }
    
      function addPeer(incomingSignal, callerID, stream) {
        const peer = new SimplePeer({
            initiator: false,
            trickle: false,
            stream,
        })
    
        peer.on("signal", (signal) => {
          console.log(`reply sent to ${callerID}`);
          socketRef.current.emit("sending reply", { signal, callerID, userid }); // {signal,the person I am sending the reply to, my id}
        })
    
        peer.signal(incomingSignal);
    
        return peer;
      }

      return (
        <div className='main'>
            <Split
                sizes={[20, 80]}
                minSize={200}
                maxSize={1000}
                direction="horizontal"
                gutterSize={10}
                gutterAlign="center"
                className="split"
                gutter={(index, direction) => {
                    const gutter = document.createElement('div');
                    gutter.className = `gutter gutter-${direction}`;
                    return gutter;
                }}
            >
                <div className="LHS-container">
                    <Main_LHS socketRef={socketRef} currentProbId={currentProbId} setCurrentProb={setCurrentProb} />
                </div>
                <div className="RHS-container">
                    <TextBox socketRef={socketRef} currentProbId={currentProbId} />
                </div>
            </Split>
            <MiniDrawer toggleMic={toggleMic} members_in_room={members_in_room} />
            {/* <AudioRecorder socket={socket} username={username} roomid={roomid}/> */}
            <Container>
                <StyledVideo muted ref={userVideo} autoPlay playsInline />
                {peers.map((peer, index) => (
                    <Video key={index} peer={peer} />
                ))}
            </Container>
        </div>
    );
};
