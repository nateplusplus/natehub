import React, { ReactElement } from 'react';

interface TabsProps {
  onChange: (tabId: number) => void;
  children: ReactElement[];
}

export default function Tabs({ onChange, children }: TabsProps) {

  /**
   * Generates unique ID for each tab, refreshes each day.
   * @param i index
   * @returns 
   */
  function getKey(i:number): string {
    const date = new Date();
    const randomNumberString = (date.getFullYear() + date.getMonth() + date.getDay() * i).toString();
    return btoa(randomNumberString);
  }

  return (
    <div className="flex w-100 mb-5">
        { children.map( (child, index) => React.cloneElement(child, { onChange, key: getKey(index) })) }
    </div>
  )
}
