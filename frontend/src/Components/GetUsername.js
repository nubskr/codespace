import * as React from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useNavigate, useParams } from 'react-router-dom';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { IconButton } from '@mui/material';

export default function GetUsername() {
    const [username,setUsername] = React.useState('');
    const {roomid} = useParams();
    const navigate = useNavigate();
    
    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    function handleSubmit(e){
        e.preventDefault();
        navigate(`/room/${roomid}/${username}`);
    }

    return (
      <Box
        sx={{
          backgroundColor : 'white',                        
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <form onSubmit={handleSubmit}>
        <TextField
          id="input-with-icon-textfield"
          label="Username"
          value={username}
          onChange={handleUsernameChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AccountCircle />
              </InputAdornment>
            ),
            sx: { fontSize: '1.2rem' } 
          }}
          variant="outlined"
          size="large"
          sx={{ width: '300px'}} // Adjust the width here
        />
        {/* <br/> */}
        <IconButton variant="contained" color="primary" type="submit">
          <ArrowForwardRoundedIcon fontSize='large'/>
        </IconButton>
        {/* <Button type="submit" variant="contained" size="large" sx={{ display: 'block', margin: '0 auto', padding: '1px' }}>Join</Button> */}
        </form>
      </Box>
    );
  }
  