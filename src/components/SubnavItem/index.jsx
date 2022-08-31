import React from 'react';
import { ListItem, ListItemButton, ListItemText } from '@mui/material';

function SubnavItem({ section, toggle, item }) {
  function handleClick() {
    toggle();

    const nbClick = new CustomEvent('nbclick', { detail: item });
    window.dispatchEvent(nbClick);
  }

  return (
    <ListItem dense={true}>
        <ListItemButton component="a" href={`#${section}`} onClick={handleClick}>
        <ListItemText inset primary={item.label} />
        </ListItemButton>
    </ListItem>
  );
}

export default SubnavItem;
