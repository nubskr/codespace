const express = require('express')
const mongoose = require('mongoose');
require('dotenv').config();
const router = express.Router();

const url = process.env.MONGODB_URI;

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
  newProblem(req.body);
})

router.get('/problem-list',async (req,res) => {
  const data = await getProblemList();
  console.log(data);
  res.json(data);
})

module.exports = router;

