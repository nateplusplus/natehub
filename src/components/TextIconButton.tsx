'use client'
import React, { ReactElement } from 'react';

interface TextIconButtonProps {
  href: string;
  children: (string | ReactElement)[];
};

export default function TextIconButton({ href, children }: TextIconButtonProps) {
  return (
    <a className="flex items-center" href={href}>
      { children }
    </a>
  );
}
