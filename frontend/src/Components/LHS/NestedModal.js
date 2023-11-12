import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import LateXparser from './LateXparser'

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

function ChildModal({text,setText,input,setInput}) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
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
          <p id="child-modal-description">
            Enter problem statement here
          </p>
          <LateXparser text={text} setText={setText} input={input} setInput={setInput} handleClose={handleClose}/>
          <div style={{ display: 'flex', gap: '20px' }}>
          <div>
            <p>Sample input here</p>
            <textarea  />
          </div>
          <div>
            <p>Sample Output here</p>
            <textarea />
          </div>
        </div>
        <div style={{ display: 'flex', gap: '20px' }}>
          <div>
            <p>Main test cases input here</p>
            <textarea  />
          </div>
          <div>
            <p>Expected output here</p>
            <textarea  />
          </div>
        </div>
          <Button onClick={handleClose}>Exit</Button>
        </Box>
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
