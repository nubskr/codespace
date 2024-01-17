const express = require('express');
const Docker = require('dockerode');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const docker = new Docker();
  
router.post('/', (req,res) => {
  const cppfilepath = path.join(__dirname,'test1','a.cpp');
  const inputfilepath = path.join(__dirname,'test1','input.txt');
  const verdictfilepath = path.join(__dirname,'test1','verdict.txt');
  const {code,input} = req.body;
console.log(code);
console.log(input);
  const containerOptions = {
    Image: 'nubskr/compiler:submission', // Replace with the image you want to run
    Cmd: ['./doshit.sh'],
    Binds: [
      // Define volume bindings in the format: hostPath:containerPath
      '/home/nubskr/projects/codespace/server/routes/test1/:/contest/',
    ],
  };
  function changeFile(path,data){
    fs.writeFile(path, data, 'utf8', (err) => {
      if (err) {
        console.error('Error writing the file:', err);
        return;
      }
      console.log('File content has been updated.');
    });
  }

  async function go(){
    // change the input and cpp file to the req
    await changeFile(cppfilepath,code);
    await changeFile(inputfilepath,input);
    await docker.createContainer(containerOptions, (err, container) => {
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
    
        container.stop((err) => {
          if (err) {
            console.error('Error stopping container:', err);
          } 
          else {
            fs.readFile(outputfilepath,'utf8', (err,data) => {
              if(err){
                res.send('shit happened bruh');
                console.error(err);
              }
              else{
                // sends the output.txt data
                res.send(data);
              }
            })
            console.log('Container stopped');
          }
        });
      });
    });
  }
  go();
})

module.exports = router;
