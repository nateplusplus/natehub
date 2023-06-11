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

interface MasonryItemData {
  image: {
    src: string;
    size: {
      height: number;
    };
  };
  heading: string,
  body: string,
  href: string,
};

const MasonryItem = ({data}: {data: MasonryItemData}) => {
  return (
    <Paper elevation={3}>
      <div className="image w-100 mb-1 bg-slate-400" style={{ height: data.image.size.height}}></div>
      <div className='p-2.5'>
        <h2 className='text-lg mb-2'>{data.heading}</h2>
        <p>{data.body}</p>
      </div>
    </Paper>
  );
}

export default function MasonryGrid({ data }: { data: MasonryItemData[] }) {
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ width: {xs: '370px', sm: '525px', md: '720px', lg: '970px', xl: '1220px', xxl: '1500px'} }}>
        <Masonry columns={{xs: 2, sm: 3, lg: 4}} spacing={3}>
          {data.map((item, index) => <MasonryItem key={index} data={item} />)}
        </Masonry>
      </Box>
    </ThemeProvider>
  );
}