const express = require('express');
const Docker = require('dockerode');
const path = require('path');
const fs = require('fs').promises;
const router = express.Router();
const docker = new Docker();
const os = require('os');

router.post('/', async (req, res) => {
  console.log(uid);
  console.log(gid);
  const cppfilepath = path.join(__dirname, 'test1', 'a.cpp');
  const inputfilepath = path.join(__dirname, 'test1', 'input.txt');
  const outputfilepath = path.join(__dirname, 'test1', 'output.txt');
  const { code, input } = req.body;

  if (!code) {
    return res.status(400).send('Code is required.');
  }

  const containerOptions = {
    Image: 'nubskr/compiler:1',
    Cmd: ['./doshit.sh'],
    HostConfig: {
      Memory: 256 * 1024 * 1024, // 512MB
      PidsLimit: 100, // Limit number of processes
      Binds: [
        '/home/nubskr/projects/codespace/server/routes/test1/:/contest/',
      ],            
      NetworkMode: 'none',
      // TODO: add more limits
    }
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

      // You can add further interactions with the container here if necessary

      await container.stop();
      console.log('Container stopped.');

      const outputData = await fs.readFile(outputfilepath, 'utf8');
      res.send(outputData);
    } catch (err) {
      console.error('Error during Docker container operation:', err);
      res.status(500).send('Internal Server Error');
    }
  }

  try {
    await changeFile(cppfilepath, code);
    await changeFile(inputfilepath, input);
    await runContainer();
  } catch (err) {
    res.status(500).send('An error occurred while processing your request.');
  }
});

module.exports = router;
