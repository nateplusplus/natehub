import './globals.css'

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { Inter } from 'next/font/google';

import Tabs from '@/components/Tabs';

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
      <body className={`${inter.className} container mx-auto`}>
        <header>
          <div className='pt-8 flex flex-col md:flex-row'>
            <div className='px-8'>
              <span className='text-2xl font-bold'>Hello, It's Me</span>
              <h1 className="text-5xl font-black">Nathan Blair</h1>
              <p className="text-base my-5">I'm a Web Developer & Artist<br /> based in Austin, TX</p>
              <p>
                <a href="#">My story →</a>
              </p>
            </div>
            <div className='my-10 grow'>
              <div className='h-80 bg-slate-400' style={{ maxWidth: '500px' }} />
            </div>
          </div>
        </header>
        <Tabs />
        <main className='px-8 w-100'>
          {children}
        </main>
      </body>
    </html>
  )
}
