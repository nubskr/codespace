import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

const drawerWidth = 180 ;
const closedWidth = 30;

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

export default function MiniDrawer({toggleMic}) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

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
          color="inherit"
          aria-label="open drawer"
          onClick={open ? handleDrawerClose : handleDrawerOpen}
          edge="start"
        >
          {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
        <button onClick={toggleMic}>
          toggle shit
        </button>
        {/* Your drawer content goes here */}
      </Drawer>
      <ContentContainer open={open} theme={theme}>
        {/* Your main content goes here */}
      </ContentContainer>
    </div>
  );
}
