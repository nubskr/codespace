import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

const drawerWidth = 180 ;
const closedWidth = 17;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: closedWidth,
  [theme.breakpoints.up('sm')]: {
    width: closedWidth,
  },
});

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

const ContentContainer = styled('div')(({ open, theme }) => ({
  marginLeft: open ? drawerWidth : closedWidth,
  transition: 'margin 225ms cubic-bezier(0.4, 0, 0.6, 1) 0ms',
  flexGrow: 1,
  padding: theme.spacing(10),
  transition: 'padding 225ms cubic-bezier(0.4, 0, 0.6, 1) 0ms',
}));

const emojis = ['🧑', '👨', '🧔', '', '', '', '', '']; // Fill in with your desired emojis

const MemberCard = ({ id , member}) => {
  const index = id % emojis.length;
  const emoji = emojis[index];

  return (
    <div className="member-card">
      <span className="emoji">{emoji}</span>
      <span className="id">{member}</span>
    </div>
  );
};

export default function MiniDrawer({toggleMic,members_in_room}) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  console.log(members_in_room);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Drawer variant="permanent" open={open}>
        <IconButton
          // color="inherit"
          aria-label="open drawer"
          onClick={open ? handleDrawerClose : handleDrawerOpen}
          edge="start"
        >
          {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
        <div>
          {open ? <p>Members in room</p> : <p></p>}
          {/* <p>Members in room</p> */}
          <div>
            {members_in_room.map((member, index) => (
          <MemberCard key={index} id={index} member={member} />
        ))}
          </div>
        </div>
        {/* Your drawer content goes here */}
      </Drawer>
      <ContentContainer open={open} theme={theme}>
        {/* Your main content goes here */}
      </ContentContainer>
    </div>
  );
}
