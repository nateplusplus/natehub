'use client'
import React from 'react';
import Link from 'next/link'
import { usePathname } from 'next/navigation';

export default function Tabs() {
  const path = usePathname();

  const inactiveTab = "border-b-2 text-neutral-700";
  const activeTab = "border-b-4 border-sky-800 text-neutral-950";

  return (
    <nav className='px-8 flex w-100 mb-5'>
      <Link href="/" className={`flex p-2 pr-10 font-medium ${ path === '/' ? activeTab : inactiveTab }`}>
        Code
      </Link>
      <Link href="/artwork" className={`flex py-2 pl-6 pr-10 font-medium ${ path === '/artwork' ? activeTab : inactiveTab }`}>
        Artwork
      </Link>
    </nav>
  );
}
