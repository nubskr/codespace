import React, { useRef } from 'react';

export default function AudioRecorder() {
  const audioRef = useRef(null);

  async function startStream() {
    try {
      const localStream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: false,
        } 
      });
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
  //      to do that we need to first make a connection, hmm interesting shit right there huh
  return (
    <div>
      <audio id="microphone_audio" ref={audioRef} autoPlay />
      <button onClick={startStream}>Start</button>
      <button onClick={stopStream}>Stop</button>
    </div>
  );
}
