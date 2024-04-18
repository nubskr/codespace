const express = require('express')
const mongoose = require('mongoose');
require('dotenv').config();
const router = express.Router();
const url = process.env.MONGODB_URI;

const redis = require('redis');
const redisClient = redis.createClient();
redisClient.connect();

redisClient.on('connect', async function() {
  console.log('Connected to Redis');
});

redisClient.on('error', function (err) {
  console.error('Redis Error:', err);
});

const ProblemSchema = new mongoose.Schema({
  id: String,
  problem_name:  String,
  statement:  String,
  sinput: String,
  soutput: String,
});

const testsSchema = new mongoose.Schema({
  id: String,
  main_tests: String,
  expected_output: String,
});

const problem_model = mongoose.model('Problem Packages',ProblemSchema);
const tests_model = mongoose.model('Test Packages',testsSchema);
mongoose.connect(url);

function newProblem(data){
  const {
    id,
    problem_name,
    statement,
    sinput,
    soutput,
    main_tests,
    expected_output,
  } = data;

  const problem_package = new problem_model({
    id,
    problem_name,
    statement,
    sinput,
    soutput,
  });

  const tests_package = new tests_model({
    id,
    main_tests,
    expected_output,
  });

  problem_package.save()
  .then(() => {
    console.log('problem_package saved successfully');
  })
  .catch(error => {
    console.error('Error saving problem_package:', error.message);
  });

  tests_package.save()

  .then(() => {
    console.log('tests_package saved successfully');
  })
  .catch(error => {
    console.error('Error saving tests_package:', error.message);
  });
}

async function getProblemList(){
  try{
    const data = await problem_model.find({});
    return data;
  }
  catch(error){
    return error;
  }
}

router.get('/', (req, res) => {
  console.log('someone came');
  res.send('Hi');
});

router.post('/new', (req,res) => {
  try{
    redisClient.flushAll();
  }
  catch(error){
    console.error(error);
  }
  newProblem(req.body);
})

router.get('/problem-list',async (req,res) => {
  try{
    var data = await redisClient.get("problem-list");
    if(data==null){
      console.log("We don't have that cached sire");
      data = await getProblemList();
      // cache the problems now
      redisClient.set("problem-list",JSON.stringify(data));
      res.send(data);
    }
    else{
      console.log("On it sire! UwU");
      data = JSON.parse(data);
      res.send(data);
    }
  }
  catch(error){
    console.error(error);
  }
})

router.post('/get-test-package', async (req,res) => {
  const {id} = req.body;
  // // console.log("requested test id is " + id);

  // const data = await tests_model.find({id: id});
  // res.json(data);
  try{
    var data = await redisClient.get("test-package");
    if(data==null){
      console.log("We don't have that cached sire");
      data = await tests_model.find({id: id});
      // cache the problems now
      redisClient.setEx("test-package",JSON.stringify(data));
      res.json(data);
    }
    else{
      console.log("On it sire! UwU");
      data = JSON.parse(data);
      res.json(data);
    }
  }
  catch(error){
    console.error(error);
  }
})

module.exports = router;

