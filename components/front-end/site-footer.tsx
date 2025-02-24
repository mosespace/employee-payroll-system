'use client';

import { usePathname } from 'next/navigation';
import React from 'react';

export default function SiteFooter() {
  function getCurrentYear(): number {
    return new Date().getFullYear();
  }

  const pathname = usePathname();

  if (pathname.includes('/waitlist')) {
    return null;
  }

  return (
    <footer className="bg-black text-white py-12 w-full mt-20">
      <div className="flex flex-col space-y-2  text-sm opacity-70 text-center font-instrument-serif">
        <span>
          {' '}
          Made with <span className="text-red-500">❤️</span>by mosespace.{' '}
          {getCurrentYear()}
        </span>{' '}
        <span>© All rights reserved.</span>
      </div>
    </footer>
  );
}
