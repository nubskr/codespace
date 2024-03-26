const express = require('express');
const Docker = require('dockerode');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const docker = new Docker();
const fetch = require('node-fetch')

const targetRouteUrl = 'http://localhost:6909/api/get-test-package';

router.post('/', (req,res) => {
  const cppfilepath = path.join(__dirname,'test1','a.cpp');
  const inputfilepath = path.join(__dirname,'test1','input.txt');
  const expectedoutputpath = path.join(__dirname,'test1','expected_output.txt');
  const verdictfilepath = path.join(__dirname,'test1','verdict.txt');
  const {code,problem_id} = req.body;
  // get the correct output file
  console.log(problem_id);
  async function getTestPackageData() {  
    try {
      const response = await fetch(targetRouteUrl, {
        method: 'POST',
        body: JSON.stringify({ id: problem_id }),
        headers: { 'Content-Type': 'application/json'}

      });
  
      // Check for successful response
      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.statusText}`);
      }
  
      const data = await response.json();
      // console.log('Received test package data:', data);
      // Use the received data as needed
      return data; // Optionally return the data if needed
    } catch (error) {
      console.error('Error fetching data:', error);
      // Handle errors here
    }
  }

console.log(code);
console.log(problem_id);
  const containerOptions = {
    Image: 'nubskr/compiler:advanced',
    Cmd: ['./doshit.sh'],
    Binds: [
      // TODO: make new files when a submission comes with uuid and delete once the response is sent
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
    console.log("problem id is " + problem_id);
    if(problem_id===null){
      res.send("You need to choose a problem");
      return;
    }
    test_package = await getTestPackageData();
    console.log(test_package[0]);
    const {expected_output,main_tests} = test_package[0];

    await changeFile(inputfilepath,main_tests);
    await changeFile(expectedoutputpath,expected_output);
    
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
            fs.readFile(verdictfilepath,'utf8', (err,data) => {
              if(err){
                res.send('shit happened bruh');
                console.error(err);
              }
              else{
                // sends the verdict.txt data
                console.log("I sent this back " + data);
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
