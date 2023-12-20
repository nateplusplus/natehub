'use client'

import React from 'react';
import ButtonGroup from '@mui/material/ButtonGroup';
import Box from '@mui/material/Box';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-solid-svg-icons';

import IconButton from '@/components/IconButton';

export default function Links() {
  return (
    <Box>
      <h2 className='mt-4 mb-2'>Code</h2>
      <ButtonGroup
        orientation="vertical"
        fullWidth={true}
      >
        <IconButton site='github'/>
        <IconButton site='linkedin'/>
      </ButtonGroup>
      <h2 className='mt-4 mb-2'>Artwork</h2>
      <ButtonGroup
        orientation="vertical"
        fullWidth={true}
      >
        <IconButton site='etsy'/>
        <IconButton site='instagram'/>
        <IconButton site='behance'/>
      </ButtonGroup>
      <Box>
        <p className='my-6 text-center text-sm'>
          Thanks for stopping by
          <FontAwesomeIcon icon={faHeart} className='ml-2' />
        </p>
      </Box>
    </Box>
  )
}
