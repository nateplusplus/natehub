import React from 'react';

import {
  Drawer,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Divider,
  ListSubheader,
  Fab,
  Zoom
} from '@mui/material';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import CodeIcon from '@mui/icons-material/Code';
import PaletteOutlinedIcon from '@mui/icons-material/PaletteOutlined';

function Nav({ collapsed, toggle }) {
  const transitionDuration = {
    enter: 300,
    exit: 300
  };

  function menuToggle() {
    return (
      <Zoom
        in={collapsed}
        timeout={transitionDuration}
        unmountOnExit
      >
        <Fab aria-label='Open menu' size='large' onClick={toggle} >
          <MenuOutlinedIcon fontSize='large' />
        </Fab>
      </Zoom>
    );
  }

  return (
    <>
      <Box sx={ {
        position: 'absolute',
        zIndex: 10,
        display: 'flex',
        justifyContent: 'flex-end',
        width: '100%',
        padding: '1rem'
      } }>
        { menuToggle() }
      </Box>
      <Drawer
        anchor='right'
        open={!collapsed}
        onClose={toggle}
        transitionDuration={transitionDuration}
      >
        <Box sx={{ position: 'relative' }}>
          <List>
            <ListSubheader>
              Jump to...
            </ListSubheader>
            <Divider />
            <ListItem disablePadding>
              <ListItemButton component="a" href="#code" onClick={toggle}>
                <ListItemIcon>
                  <CodeIcon />
                </ListItemIcon>
                <ListItemText primary="Code" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component="a" href="#artwork" onClick={toggle}>
                <ListItemIcon>
                  <PaletteOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Artwork" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </>
  );
}

export default Nav;
