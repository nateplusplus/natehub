import React, { ReactElement } from 'react';

interface TabPanelProps {
  activeId: number;
  tabId: number;
  children: ReactElement | ReactElement[];
}

export default function TabPanel({ tabId, activeId=0, children }: TabPanelProps ) {

  function content() {
    return (
    <div className="w-100">
        { children }
    </div>
    );
  }

  return (!tabId || tabId === activeId) ? content() : <></>;
}
