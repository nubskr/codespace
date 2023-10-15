const express = require('express');
const Docker = require('dockerode');
const router = express.Router();

const docker = new Docker();
const containerOptions = {
    Image: 'compiler:UwU', // Replace with the image you want to run
    Cmd: ['./doshit.sh'],
    Binds: [
      // Define volume bindings in the format: hostPath:containerPath
      '/home/nubskr/Stuff/server/routes/test1/:/contest/',
      // '/path/on/host:/path/in/container'
    ],
  };
  function go(){
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
  }
  
router.get('/', (req,res) => {
    res.send('test');
    go();
})

module.exports = router;
