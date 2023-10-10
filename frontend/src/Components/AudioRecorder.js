import React, { useEffect, useRef } from 'react';
import io from 'socket.io-client';
const configuration = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }, {urls: "stun:stun1.l.google.com:19302"}] };
const peerConnection = new RTCPeerConnection(configuration);
const socket = io("http://localhost:6969/", { transports: ['websocket'] });

export default function AudioRecorder() {
  const audioRef = useRef(null);
  async function setupwebRTC() {
    try{
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      console.log(offer);
      socket.emit('send-offer',offer);
    }
    catch(error){
      console.error(error);
    }
  }

  useEffect(() => {
    async function doshit(offer){
      await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      socket.emit('send-answer',answer);
    }

    socket.on('receive-offer',(offer) => {
      console.log(offer);
      try{
        // Assuming remoteOffer contains the received SDP offer
        doshit(offer);
      }
      catch(error){
        console.error(error);
      }
      // accept the offer and send my own as well UwU
    })

    socket.on('receive-ans', (offer) => {
      console.log(offer);
      try {
        // Assuming remoteOffer contains the received SDP offer
        async function setRemoteDescriptionAndICEHandler() {
          await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
          console.log('1');
          // Set the onicecandidate event handler
          peerConnection.onicecandidate = (event) => {
            console.log('2');
            if (event.candidate) {
              console.log('Sending ICE candidate to the remote peer');
              socket.emit('send-ice-cand', event.candidate);
            } else {
              console.log('ICE candidate gathering complete');
            }
          };
          console.log('3');
        }
        setRemoteDescriptionAndICEHandler();
      } catch (error) {
        console.error(error);
      }
    })
    

    socket.on('receive-ice-cand',(shit) => {
      console.log('receive ice cand');
      peerConnection.addIceCandidate(new RTCIceCandidate(shit));
    })

  },[socket]);

  async function startStream() {
    setupwebRTC();
    try {
      const localStream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          // echoCancellation: false, // turning it off increases the vocal quality but also increases background noise, :angycat:
        },
      });
      // since we are only doing audio, there will be only one track, if we did video as well, then there would be two tracks
      localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

      // Assign the stream to the video element sourceObject
      audioRef.current.srcObject = localStream;
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  }

  function stopStream() {
    const localStream = audioRef.current.srcObject;
    // this stops the microphone from taking in any audio
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0]; // Get the first audio track
      if (audioTrack) {
        audioTrack.stop(); // Stop the audio track
      }
    }
  }
  // TODO: now just send the audio stream over to webRTC
  return (
    <div>
      <audio id="microphone_audio" ref={audioRef} autoPlay />
      <button onClick={startStream}>Start</button>
      <button onClick={stopStream}>Stop</button>
    </div>
  );
}
