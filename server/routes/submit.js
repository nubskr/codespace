const express = require('express');
const router = express.Router();

const {submissionQueue,waitforJobCompletion} = require('../jobs/submissionWorker')

router.post('/', async (req, res) => {
  const { code, problem_id } = req.body;
  // console.log(code,problem_id);
  if (!code || !problem_id) {
    return res.status(400).send('Code and problem ID are required.');
  }

  const job = await submissionQueue.add('submissionProcess',{code: code, problemId: problem_id});
  const verdictData = await waitforJobCompletion(submissionQueue,job);


  //TODO: delete the folder now ffs bruh

  res.send(verdictData);

});

module.exports = router;
