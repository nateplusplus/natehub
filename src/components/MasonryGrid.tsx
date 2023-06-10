import React from 'react';
import Paper from '@mui/material/Paper';
import Masonry from '@mui/lab/Masonry';
import { Box } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface BreakpointOverrides {
    xs: true;
    sm: true;
    md: true;
    lg: true;
    xl: true;
    xxl: true;
  }
}

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
    },
  },
});

const MasonryItem = ({height, children}: {height: number, children: number}) => {
  return (
    <Paper elevation={3} sx={{ height }}>
      {children}
    </Paper>
  );
}


export default function MasonryGrid() {
  const heights = [150, 30, 90, 70, 110, 150, 130, 80, 50, 90, 100, 150, 30, 50, 80];

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ width: {xs: '370px', sm: '525px', md: '720px', lg: '970px', xl: '1220px', xxl: '1500px'} }}>
        <Masonry columns={{xs: 2, sm: 3, lg: 4}} spacing={2}>
          {heights.map((height, index) => (
            <MasonryItem key={index} height={height}>
              {index + 1}
            </MasonryItem>
          ))}
        </Masonry>
      </Box>
    </ThemeProvider>
  );
}