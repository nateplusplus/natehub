'use client'

import React, {useState} from 'react'; 
import Tabs from '@/components/Tabs';
import Tab from '@/components/Tab';
import TabPanel from '@/components/TabPanel';

export default function Home() {
  const [ activeTabId, setActiveTabId ] = useState(0);
  console.log(activeTabId);

  function handleTabChange(tabId: number) {
    console.log(tabId);
  }

  return (
    <>
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
      <main className='px-8'>
        <Tabs onChange={handleTabChange}>
          <Tab>Hello</Tab>
          <Tab>World</Tab>
        </Tabs>
        <div>
          <TabPanel tabId={0} activeId={activeTabId}>
            <p>Hello Test</p>
          </TabPanel>
          <TabPanel tabId={1} activeId={activeTabId}>
            <p>World Test</p>
          </TabPanel>
        </div>
      </main>
    </>
  )
}
