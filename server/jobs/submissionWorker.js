const {Job, Queue, Worker, QueueEvents} = require('bullmq')
const fs = require('fs');
const path = require('path');
const Docker = require('dockerode');
const docker = new Docker();

require('dotenv').config();

const connectionOptions = {
    host: '0.0.0.0',
    port: 6379
};

// this always runs inhouse, so we should be fine with hardcoding it
const targetRouteUrl = 'http://localhost:6909/api/get-test-package';
const submissionQueue = new Queue('submissionProcess',{connection: connectionOptions});

async function getTestPackageData(problem_id) {
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

function changeFile(filePath, data) {
    try {
      fs.writeFileSync(filePath, data, 'utf8');
      console.log(`File content at ${filePath} has been updated.`);
    } catch (err) {
      console.error('Error writing the file:', err);
      throw err;
    }
}

async function runContainer(containerOptions) {
    try {
        const container = await docker.createContainer(containerOptions);
        await container.start();
        console.log('Container started successfully.');

        // Additional interactions with the container can be added here

        await container.stop();
        console.log('Container stopped.');
    } catch (err) {
        console.error('Error during Docker container operation:', err);
    }
} 

async function submissionWorker(job) {
    console.log("Anyone homeeee?")
    // creates a whole new folder for this thing
    const reqId = job.id;
    const folderPath = path.join(__dirname,'..','routes','test1',reqId);

    return new Promise((resolve, reject) => {
        fs.mkdir(folderPath, { recursive: true }, async (err) => {
            if (err) {
                reject(`Error: ${err.message}`);
                console.error(err);
                return;
            }
    
            console.log("Folder created!");
    
            try {
                // The request has a problem ID and the code
                const { code, problemId } = job.data;
                // Get the test package
                const testPackage = await getTestPackageData(problemId);
                console.log("test package is",testPackage);
                // Define file paths
                const cppfilepath = path.join(folderPath, 'a.cpp');
                const inputfilepath = path.join(folderPath, 'input.txt');
                const expectedoutputpath = path.join(folderPath, 'expected_output.txt');
                const verdictfilepath = path.join(folderPath, 'verdict.txt');
                const test_path = path.join(folderPath);
                const { expected_output, main_tests } = testPackage;
    
                // Change files
                await changeFile(inputfilepath, main_tests);
                await changeFile(expectedoutputpath, expected_output);
                await changeFile(cppfilepath, code);
                await changeFile(verdictfilepath, ''); // Create empty file
                console.log('Files changed!');
    
                // Container options
                const containerOptions = {
                    Image: 'nubskr/compiler:1',
                    Cmd: ['./doshit.sh'],
                    HostConfig: {
                        Memory: 256 * 1024 * 1024, // 256MB
                        PidsLimit: 100, // Limit number of processes
                        Binds: [`${test_path}:/contest/`],
                        NetworkMode: 'none',
                    }
                };
    
                // Run container
                await runContainer(containerOptions);
    
                // Read verdict data
                const verdictData = fs.readFileSync(verdictfilepath, 'utf8');
                console.log(verdictData);
    
                resolve(verdictData);
            } catch (err) {
                reject(`Error: ${err.message}`);
                console.error(err);
            }
        });
    });
    
}

function waitforJobCompletion(queue,job){
    // checks the status
    const queueEvents = new QueueEvents(queue.name);
    return new Promise(function(resolve,reject){
      function completedHandler({jobId,returnvalue}) {
        console.log("something passed");
        if(jobId === job.id){
          // console.log("we done ????");
          // our work is done here, remove the event listeners
          queueEvents.off('completed', completedHandler);
          queueEvents.off('failed', failedHandler);
          resolve(returnvalue);
        }
      }
  
      function failedHandler({jobId,failedReason}) {
        // console.log("something failed");
        if(jobId === job.id){
          queueEvents.off('completed', completedHandler);
          queueEvents.off('failed', failedHandler);
          reject(failedReason);
        }
      }
      queueEvents.on("completed",completedHandler);
      queueEvents.on("failed",failedHandler);
    })
  }

const worker = new Worker('submissionProcess',submissionWorker,{
  connection: connectionOptions,
  concurrency: parseInt(process.env.CONCURRENT_SUBMISSION_WORKERS)
});

module.exports = {submissionQueue, submissionWorker: worker, waitforJobCompletion};