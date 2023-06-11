'use client'

import React from 'react';
import GitHubIcon from '@mui/icons-material/GitHub';

import TextIconButton from '@/components/TextIconButton';
import MasonryGrid from '@/components/MasonryGrid';


export default function Code() {
  const data = [
    {
      image: {
        src: '',
        size: {
          height: 150,
        },
      },
      heading: 'PushIn.js',
      body: 'Lorem ipsum dolor sit amet.',
      href: '#',
    },
    {
      image: {
        src: '',
        size: {
          height: 250,
        },
      },
      heading: 'Lorem Ipsum',
      body: 'Lorem ipsum dolor sit amet.',
      href: '#',
    },
    {
      image: {
        src: '',
        size: {
          height: 100,
        },
      },
      heading: 'Lorem Ipsum',
      body: 'Lorem ipsum dolor sit amet.',
      href: '#',
    },
    {
      image: {
        src: '',
        size: {
          height: 300,
        },
      },
      heading: 'Lorem Ipsum',
      body: 'Lorem ipsum dolor sit amet.',
      href: '#',
    }
  ];

  return (
    <div>
      <div className='flex flex-col mb-10'>
        <p style={{ maxWidth: '992px' }}> Code. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptate culpa quo temporibus illum perferendis dolor, repudiandae ipsam, recusandae iste totam aperiam impedit adipisci accusantium quisquam! Quaerat minus quibusdam iure quisquam.</p>
        <p>
          <TextIconButton href="#">
            <GitHubIcon className='mr-2' />
            GitHub Profile
          </TextIconButton>
        </p>
      </div>
      <div className='flex md:block justify-center'>
        <MasonryGrid data={data} />
      </div>
    </div>
  )
}
