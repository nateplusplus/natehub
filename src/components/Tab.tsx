import React, { ReactElement } from 'react';

type TabProps = { children: string | ReactElement | ReactElement[] };

export default function Tabs({ children }: TabProps ) {
  return (
    <div className="flex p-2 border-b-2" style={{ minWidth: '6rem' }}>
        { children }
    </div>
  )
}
