import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import LateXparser from './LateXparser';
import EditIcon from '@mui/icons-material/Edit';
import { styled } from '@mui/system';

const BlackButton = styled(Button)(({ theme }) => ({
  color: 'black', // Set the color to black
}));

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 1000,
  height: 500,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function ProblemInputModal({text,setText,input,setInput}) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <BlackButton 
        onClick={handleOpen}
        // variant="outlined" // You can change the variant as needed
        color="primary" // You can change the color as needed
        startIcon={<EditIcon />} // Add the EditIcon as a start icon
      >
      </BlackButton>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Edit problem statement
          </Typography>
          {/* <Typography id="modal-modal-description" sx={{ mt: 2 }}> */}
            <LateXparser text={text} setText={setText} input={input} setInput={setInput} handleClose={handleClose}/>
          {/* </Typography> */}
        </Box>
      </Modal>
    </div>
  );
}
