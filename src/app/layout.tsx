import './globals.css'

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { Inter } from 'next/font/google';
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'NateHub',
  description: 'Portfolio website of a Software Engineer and watercolor painter based in Austin, TX.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header>
          <div className='pt-8'>
            <div className='px-8'>
              <span className='text-2xl font-bold'>Hello, It's Me</span>
              <h1 className="text-5xl font-black">Nathan Blair</h1>
              <p className="text-base my-5">I'm a Web Developer & Artist<br /> based in Austin, TX</p>
              <p>
                <a href="#">My story →</a>
              </p>
            </div>
            <div className='h-80 bg-slate-400 my-10' />
          </div>
        </header>
        <nav className='px-8 flex w-100 mb-5'>
          <Link href="/" className="flex p-2 border-b-2" style={{ minWidth: '6rem' }}>Code</Link>
          <Link href="/artwork" className="flex p-2 border-b-2" style={{ minWidth: '6rem' }}>Artwork</Link>
        </nav>
        <main className='px-8 w-100'>
          {children}
        </main>
      </body>
    </html>
  )
}
