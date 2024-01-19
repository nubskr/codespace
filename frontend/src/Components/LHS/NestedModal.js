import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import LateXparser from './LateXparser'
import axios from 'axios';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '100px',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
  overflow: 'auto',
};

const api = 'http://localhost:6909/api/new'

function ChildModal({text,setText,input,setInput}) {
  const [open, setOpen] = React.useState(false);
  const [problemName, setProblemName] = React.useState('');
  const [statement, setStatement] = React.useState('');
  const [sampleInput, setSampleInput] = React.useState('');
  const [sampleOutput, setSampleOutput] = React.useState('');
  const [mainTestsInput, setMainTestsInput] = React.useState('');
  const [expectedOutput, setExpectedOutput] = React.useState('');

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(api, {
        problem_name: problemName,
        statement,
        sinput: sampleInput,
        soutput: sampleOutput,
        main_tests: mainTestsInput,
        expected_output: expectedOutput,
      });

      console.log(response.data.message); // Log the server response
      // Optionally, you can reset your form fields or perform other actions here
    } catch (error) {
      console.error('Error sending data to the server:', error.message);
    }
  };

  return (
    <React.Fragment>
      <Button onClick={handleOpen}>Create new problem</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box sx={{ ...style, width: 1500, height: 700 }}>
          <h2 id="child-modal-title">Create new problem</h2>
          <p>
            Name your problem here
          </p>
          <textarea  
            value={problemName}
            onChange={(e) => setProblemName(e.target.value)}
          />
          <p id="child-modal-description">
            Enter problem statement here
          </p>
          <LateXparser text={statement} setText={setStatement} input={input} setInput={setInput} handleClose={handleClose}/>
          <div style={{ display: 'flex', gap: '20px' }}>
          <div>
            <p>Sample input here</p>
            <textarea  
                value={sampleInput}
                onChange={(e) => setSampleInput(e.target.value)}
            />
          </div>
          <div>
            <p>Sample Output here</p>
            <textarea 
                value={sampleOutput}
                onChange={(e) => setSampleOutput(e.target.value)}
            />
          </div>
        </div>
        <div style={{ display: 'flex', gap: '20px' }}>
          <div>
            <p>Main test cases input here</p>
            <textarea  
              value={mainTestsInput}
              onChange={(e) => setMainTestsInput(e.target.value)}
            />
          </div>
          <div>
            <p>Expected output here</p>
            <textarea  
              value={expectedOutput}
              onChange={(e) => setExpectedOutput(e.target.value)}
            />
          </div>
        </div>
          <Button onClick={handleClose}>Exit</Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </Box>

        {/* Copied shit */}
            {/* <Box sx={{ ...style, width: 1500, height: 700 }}>
      <h2 id="child-modal-title">Create new problem</h2>
      <p>Name your problem here</p>
      <textarea
        value={problemName}
        onChange={(e) => setProblemName(e.target.value)}
      />
      <p id="child-modal-description">Enter problem statement here</p>
      <LateXparser text={statement} setText={setStatement} />
      <div style={{ display: 'flex', gap: '20px' }}>
        <div>
          <p>Sample input here</p>
          <textarea
            value={sampleInput}
            onChange={(e) => setSampleInput(e.target.value)}
          />
        </div>
        <div>
          <p>Sample Output here</p>
          <textarea
            value={sampleOutput}
            onChange={(e) => setSampleOutput(e.target.value)}
          />
        </div>
      </div>
      <div style={{ display: 'flex', gap: '20px' }}>
        <div>
          <p>Main test cases input here</p>
          <textarea
            value={mainTestsInput}
            onChange={(e) => setMainTestsInput(e.target.value)}
          />
        </div>
        <div>
          <p>Expected output here</p>
          <textarea
            value={expectedOutput}
            onChange={(e) => setExpectedOutput(e.target.value)}
          />
        </div>
      </div> */}
      {/* <Button onClick={handleSubmit}>Submit</Button>
    </Box> */}
      </Modal>
    </React.Fragment>
  );
}

export default function NestedModal({text,setText,input,setInput}) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button onClick={handleOpen}>Open modal</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style, width: 400 }}>
          <h2 id="parent-modal-title">Change problem</h2>
          <p id="parent-modal-description">
            Present problems will show up here
          </p>
          <ChildModal  text={text} setText={setText} input={input} setInput={setInput} handleClose={handleClose}/>
        </Box>
      </Modal>
    </div>
  );
}
