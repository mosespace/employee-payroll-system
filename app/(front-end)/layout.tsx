import SiteFooter from '@/components/front-end/site-footer';
import SiteHeader from '@/components/front-end/site-header';
import React from 'react';

export default function FrontEndLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div>
      <SiteHeader />
      {children}
      <SiteFooter />
    </div>
  );
}
