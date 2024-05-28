const express = require('express');
const Docker = require('dockerode');
const path = require('path');
const fs = require('fs').promises;
const router = express.Router();
const docker = new Docker();
const fetch = require('node-fetch');

const targetRouteUrl = 'http://localhost:6909/api/get-test-package';

router.post('/', async (req, res) => {
  const cppfilepath = path.join(__dirname, 'test1', 'a.cpp');
  const inputfilepath = path.join(__dirname, 'test1', 'input.txt');
  const expectedoutputpath = path.join(__dirname, 'test1', 'expected_output.txt');
  const verdictfilepath = path.join(__dirname, 'test1', 'verdict.txt');
  const { code, problem_id } = req.body;

  if (!code || !problem_id) {
    return res.status(400).send('Code and problem ID are required.');
  }

  async function getTestPackageData() {
    try {
      const response = await fetch(targetRouteUrl, {
        method: 'POST',
        body: JSON.stringify({ id: problem_id }),
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }

  const containerOptions = {
    Image: 'nubskr/compiler:advanced',
    Cmd: ['./doshit.sh'],
    Binds: [
      '/home/nubskr/projects/codespace/server/routes/test1/:/contest/',
    ],
  };

  async function changeFile(filePath, data) {
    try {
      await fs.writeFile(filePath, data, 'utf8');
      console.log(`File content at ${filePath} has been updated.`);
    } catch (err) {
      console.error('Error writing the file:', err);
      throw err;
    }
  }

  async function runContainer() {
    try {
      const container = await docker.createContainer(containerOptions);
      await container.start();
      console.log('Container started successfully.');

      // Additional interactions with the container can be added here

      await container.stop();
      console.log('Container stopped.');

      const verdictData = await fs.readFile(verdictfilepath, 'utf8');
      res.send(verdictData);
    } catch (err) {
      console.error('Error during Docker container operation:', err);
      res.status(500).send('Internal Server Error');
    }
  }

  try {
    await changeFile(cppfilepath, code);

    const testPackage = await getTestPackageData();
    
    try{
      const { expected_output, main_tests } = testPackage[0];

      await changeFile(inputfilepath, main_tests);
      await changeFile(expectedoutputpath, expected_output);
  
      await runContainer(); 
    }
    catch(err){
      res.send(500).send("error processing request");
    }
  } catch (err) {
    res.status(500).send('An error occurred while processing your request.');
  }
});

module.exports = router;
