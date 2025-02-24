'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function SiteHeader() {
  const pathname = usePathname();

  if (pathname.includes('/waitlist')) {
    return null;
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black text-white backdrop-blur-lg  h-[66px] flex items-center">
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo container */}
        <div className="lg:absolute lg:left-[271px]">
          <h2 className="font-bold text-2xl">EPMS</h2>
        </div>

        {/* Right side elements */}
        <div className="lg:absolute lg:right-[271px] flex items-center gap-[40px]">
          <Link
            href="/changelog"
            className="text-[13px] font-medium text-gray-50 hover:text-white transition-colors font-instrument-sans"
          >
            Changelog
          </Link>
          <Link
            href="/waitlist"
            className="text-[13px] font-medium bg-white text-black px-[13px] pt-[8px] pb-[8px] rounded-[7px] transition-colors font-instrument-sans"
          >
            Request Access
          </Link>
        </div>
      </div>
    </header>
  );
}
