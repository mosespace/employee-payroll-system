'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';

export default function Breadcrumb() {
  const pathname = usePathname();
  const pathArr = pathname.split('/');
  pathArr.shift();
  // console.log(pathArr);
  return (
    <nav className="md:flex hidden" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
        {pathArr.map((item, i) => {
          const path = '/' + pathArr.slice(0, i + 1).join('/');
          const isLast = i === pathArr.length - 1;
          return (
            <li key={i}>
              <div className="flex items-center capitalize">
                <ChevronRight className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" />
                {isLast ? (
                  <span className="ms-1 text-sm font-light text-gray-700 md:ms-2 dark:text-gray-400">
                    {item}
                  </span>
                ) : (
                  <Link
                    href={path}
                    className="ms-1 text-sm text-gray-700 font-semibold hover:text-primary md:ms-2 dark:text-gray-500 dark:hover:text-white"
                  >
                    {item}
                  </Link>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
