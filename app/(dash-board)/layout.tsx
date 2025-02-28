import { AppSidebar } from '@/components/back-end/app-sidebar';

import { Separator } from '@/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import React from 'react';
import Breadcrumb from '../../components/back-end/breadcrumb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function BackEndLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect(`/login?callback=${encodeURIComponent('/dashboard')}`);
  }

  // console.log(`Session User:`, session);

  return (
    <SidebarProvider>
      <AppSidebar user={session?.user} />
      <SidebarInset>
        <header className="sticky top-0 z-10 border-[0.5px] flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div>
            <Breadcrumb />
          </div>
        </header>
        <div className="flex max-w-5xl mx-auto w-full min-h-screen">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
