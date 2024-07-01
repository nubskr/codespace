const {Job, Queue, Worker} = require('bullmq')
const {redisClient} = require('../model/redisModel')
const {exec} = require('child_process');
const { stderr } = require('process');

require('dotenv').config();

const connectionOptions = {
    host: '0.0.0.0',
    port: 6379
};

const scrapingQueue = new Queue('scrapingProcess',{connection: connectionOptions});
const submissionQueue = new Queue('submissionProcess',{connection: connectionOptions});

async function scrapingWorker(job) {
    console.log("something in");
    const req_problem = job.data;
    console.log(req_problem);
    return new Promise((resolve, reject) => {
        exec(`python3 routes/scraper.py ${req_problem}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                reject(`Error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.error(`stderr: ${stderr}`);
                reject(`Error: ${stderr}`);
                return;
            }
            try {
                const parsedOutput = JSON.parse(stdout);
                //TODO: backend crashes here if link is invalid
                redisClient.setEx(req_problem, 60000, JSON.stringify(parsedOutput));
                resolve(parsedOutput);
            } catch (err) {
                console.error(err);
                reject("Invalid link");
                throw err;
            }
        });
    });
}

const worker = new Worker('scrapingProcess',scrapingWorker, {
    connection: connectionOptions,
    concurrency: parseInt(process.env.CONCURRENT_SCRAPING_WORKERS)
});
    

module.exports = {scrapingQueue, scrapingWorker: worker};