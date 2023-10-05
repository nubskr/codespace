const express = require('express');
const Docker = require('dockerode');
const router = express.Router();

const docker = new Docker();
const containerOptions = {
    Image: 'ubuntu:latest', // Replace with the image you want to run
    Cmd: ['/bin/bash', '-c', 'echo Hello, Docker!'], // Replace with the desired command
  };
  
  docker.createContainer(containerOptions, (err, container) => {
    if (err) {
      console.error('Error creating container:', err);
      return;
    }
  
    container.start((err, data) => {
      if (err) {
        console.error('Error starting container:', err);
        return;
      }
      console.log('Container started successfully:', data);
  
      // You can now interact with the running container here
  
      // To stop the container when you're done:
      container.stop((err) => {
        if (err) {
          console.error('Error stopping container:', err);
        } else {
          console.log('Container stopped');
        }
      });
    });
  });
router.get('/', (req,res) => {
    res.send('test');
})

module.exports = router;