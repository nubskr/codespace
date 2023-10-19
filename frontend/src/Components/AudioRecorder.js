import React, { useEffect, useRef } from 'react';
import io from 'socket.io-client';
const configuration = { iceServers: [{ urls: "stun:stun.schlund.de:3478" }] };
const peerConnection = new RTCPeerConnection(configuration);
const socket = io("http://localhost:6909/", { transports: ['websocket'] });

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
    receive_audio();
  })
  async function receive_audio(){
    try {
      console.log('test');
      // Set up WebRTC to receive audio

      // Create a new MediaStream to hold the received audio
      const remoteStream = new MediaStream();
      // Set up a handler for incoming tracks
      peerConnection.ontrack = (event) => {
        console.log('received audio');
        remoteStream.addTrack(event.track); // Add the received audio track to the remote stream
        audioRef.current.srcObject = remoteStream;
      };

      // Handle offers, answers, and ICE candidates (as in your existing code)

      // Set the received audio stream on the audio element
      // audioRef.current.srcObject = remoteStream;
    } catch (error) {
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
    })

    socket.on('receive-ans', (offer) => {
      console.log(offer);
      // Assuming remoteOffer contains the received SDP offer
      async function setRemoteDescriptionAndICEHandler() {
        try {
          await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
          // Set the onicecandidate event handler
          peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
              console.log('Sending ICE candidate to the remote peer');
              socket.emit('send-ice-cand', event.candidate);
            } else {
              console.log('ICE candidate gathering complete');
              // Now that ICE gathering is complete, you can start audio streaming
              receive_audio();
            }
          };
        } catch (error) {
          console.error(error);
        }
      }
      setRemoteDescriptionAndICEHandler();
  
    })
    

    socket.on('receive-ice-cand',(shit) => {
      console.log('receive ice cand');
      peerConnection.addIceCandidate(new RTCIceCandidate(shit));
    })

  },[socket]);
  
  async function startStream() {
    try {
      const localStream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          // echoCancellation: false, // turning it off increases the vocal quality but also increases background noise, :angycat:
        },
        video: true
      });
      // since we are only doing audio, there will be only one track, if we did video as well, then there would be two tracks
      localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));
      setupwebRTC();
      // Assign the stream to the video element sourceObject
      // audioRef.current.srcObject = localStream; // play your own audio to yourself, self love UwU
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  }

  function stopStream() {
    const localStream = audioRef.current.srcObject;
    // this stops the microphone from taking in any audio
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0]; // Get the audio track
      if (audioTrack) {
        audioTrack.stop(); // Stop the audio track
      }
    }
  }
  startStream();
  // TODO: now just send the audio stream over to webRTC
  return (
    <div>
      <video id="microphone_audio" ref={audioRef} autoPlay />
      {/* <button onClick={startStream}>Start</button> */}
      {/* <button onClick={stopStream}>Stop</button> */}
    </div>
  );
}
