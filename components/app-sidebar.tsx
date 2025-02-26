'use client';

import {
  ArrowLeftRight,
  BadgeEuro,
  GalleryVerticalEnd,
  LayoutGrid,
  Settings,
  Users,
} from 'lucide-react';
import * as React from 'react';

import { SidebarOptInForm } from '@/components/sidebar-opt-in-form';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { buttonVariants } from './ui/button';
import { usePathname } from 'next/navigation';
import { Separator } from './ui/separator';
import { siteConfig } from '@/constants/site';

// This is sample data.

export const data = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutGrid,
    active: true,
  },
  {
    title: 'Payroll',
    href: '/dashboard/payroll',
    icon: BadgeEuro,
    active: true,
  },
  {
    title: 'Integrations',
    href: '/dashboard/integrations',
    icon: ArrowLeftRight,
  },
  {
    title: 'Employees',
    href: '/dashboard/employees',
    icon: Users,
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <div className="flex flex-col w-full">
                <a href="#" className="flex w-full gap-2">
                  <img
                    className="w-8 h-8"
                    src={siteConfig.logo}
                    alt={siteConfig.description}
                  />
                  <span className="flex flex-col gap-0.5 leading-none">
                    <span className="font-semibold">{siteConfig.name}</span>
                    <span className="">v1.0.0</span>
                  </span>
                </a>
                <Separator />
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <nav className={cn('flex space-y-1 lg:space-y-2 flex-col')} {...props}>
          {data.map((item) => {
            const segments = pathname.split('/dashboard').filter(Boolean);

            const isActive = (href: string) => {
              if (href === '/dashboard') {
                return pathname === '/dashboard';
              }
              if (pathname === href) return true;
              if (!segments[0]) return false;

              const hrefWithoutDashboard = href.replace('/dashboard', '');
              return segments[0].startsWith(hrefWithoutDashboard);
            };
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  buttonVariants({ variant: 'ghost' }),
                  isActive(item.href)
                    ? 'bg-muted rounded-none hover:bg-muted'
                    : 'hover:bg-transparent hover:underline',
                  'justify-start gap-2',
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </Link>
            );
          })}
        </nav>{' '}
      </SidebarContent>
      <SidebarFooter>
        <div className="p-1">
          <SidebarOptInForm />
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
