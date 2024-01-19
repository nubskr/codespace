const express = require('express')
const mongoose = require('mongoose');
require('dotenv').config();
const router = express.Router();

const url = process.env.MONGODB_URI;
const dbName = 'Codespaces';

const Schema1 = new mongoose.Schema({
  problem_name:  String,
  statement:  String,
  sinput: String,
  soutput: String,
  main_tests: String,
  expected_output: String,
});

function newProblem(data){
  mongoose.connect(url)
    .then(() => {
      console.log('Connected to MongoDB');
      // Update problem packages
      // problem_name + Problem statement + Sample input + Sample output + Main Tests + Expected output
      
        const {
          problem_name,
          statement,
          sinput,
          soutput,
          main_tests,
          expected_output,
        } = data;
    
        const Model1 = mongoose.model('Problem Packages',Schema1);
    
        const problem_package = new Model1({
          problem_name: problem_name,
          statement:  statement,
          sinput: sinput,
          soutput: soutput,
          main_tests: main_tests,
          expected_output: expected_output,
        });
    
        problem_package.save()
        .then(() => {
          console.log('Data saved successfully');
        })
        .catch(error => {
          console.error('Error saving data:', error.message);
        });

      router.post('/new', (req,res) => {
        newProblem(req.body());
      })

      // Access the problem packages 
      
    })
    .catch(error => {
      console.error('Error:', error.message);
    });
}

router.get('/', (req, res) => {
  console.log('someone came');
  res.send('Hi');
});

router.post('/new', (req,res) => {
  newProblem(req.body);
})
// module.exports = connectDB;
module.exports = router;

