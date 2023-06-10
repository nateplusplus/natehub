'use client'

import React from 'react';
import GitHubIcon from '@mui/icons-material/GitHub';

import TextIconButton from '@/components/TextIconButton';
import MasonryGrid from '@/components/MasonryGrid';

export default function Code() {
  return (
    <div>
      <p>Code</p>
      <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptate culpa quo temporibus illum perferendis dolor, repudiandae ipsam, recusandae iste totam aperiam impedit adipisci accusantium quisquam! Quaerat minus quibusdam iure quisquam.</p>
      <p>
        <TextIconButton href="#">
          <GitHubIcon className='mr-2' />
          GitHub Profile
        </TextIconButton>
      </p>
      <div className='flex md:block justify-center'>
        <MasonryGrid />
      </div>
    </div>
  )
}
