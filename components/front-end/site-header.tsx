'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function SiteHeader() {
  const pathname = usePathname();

  if (pathname.includes('/waitlist')) {
    return null;
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/30 text-black backdrop-blur-lg  h-[66px] flex items-center">
      <div className="container max-w-5xl mx-auto px-4 flex justify-between items-center">
        {/* Logo container */}
        <div className="flex items-center">
          <img src="/logo.svg" className="w-8 h-8" alt="" />
          <h2 className="font-bold text-2xl">EPMS</h2>
        </div>

        {/* Right side elements */}
        <div className="flex items-center gap-[40px]">
          <Link
            href="/changelog"
            className="text-[13px] font-medium text-black/60 transition-colors font-instrument-sans"
          >
            Changelog
          </Link>
          <Link
            href="/waitlist"
            className="text-[13px] font-medium bg-primary text-white px-[13px] pt-[8px] pb-[8px] rounded-[7px] transition-colors font-instrument-sans"
          >
            Request Access
          </Link>
        </div>
      </div>
    </header>
  );
}
