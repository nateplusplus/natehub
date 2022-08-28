import React from 'react';

import {
  IconButton,
  Container,
  Fade,
  Drawer,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import CodeIcon from '@mui/icons-material/Code';
import PaletteOutlinedIcon from '@mui/icons-material/PaletteOutlined';

function Nav({ collapsed, toggle }) {
  return (
    <>
      <Container sx={ {
        position: 'absolute', zIndex: 100, display: 'flex', justifyContent: 'flex-end'
      } }>
        <Fade in={collapsed}>
          <IconButton aria-label='Open menu' size='large' onClick={toggle} sx={{ position: 'absolute' }}>
              <MenuOutlinedIcon fontSize='large' sx={{ color: '#ffffff' }} />
          </IconButton>
        </Fade>
      </Container>
      <Drawer anchor='right' open={!collapsed}>
        <Box sx={{ padding: '1rem 1.5rem' }}>
          <Fade in={!collapsed}>
            <IconButton aria-label='Close menu' size='large' onClick={toggle}>
                <CloseIcon fontSize='large' />
            </IconButton>
          </Fade>
          <List>
            <ListItem disablePadding>
              <ListItemButton component="a" href="#code">
                <ListItemIcon>
                  <CodeIcon />
                </ListItemIcon>
                <ListItemText primary="Code" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component="a" href="#artwork">
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
