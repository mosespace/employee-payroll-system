'use client';

import {
  AlignVerticalJustifyEnd,
  ArrowLeftRight,
  BadgeEuro,
  DollarSign,
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
import { siteConfig } from '@/constants/site';
import { cn } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { buttonVariants } from '../ui/button';
import { Separator } from '../ui/separator';
import { NavUser } from './nav-user';

// This is sample data.

export const data = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutGrid,
    roles: ['ADMIN', 'EMPLOYEE', 'MANAGER'],
  },
  {
    title: 'Payroll',
    href: '/dashboard/payroll',
    icon: BadgeEuro,
    roles: ['ADMIN', 'MANAGER'],
  },
  {
    title: 'Attendances',
    href: '/dashboard/attendance',
    icon: AlignVerticalJustifyEnd,
    roles: ['ADMIN', 'EMPLOYEE', 'MANAGER'],
  },
  {
    title: 'Integrations',
    href: '/dashboard/integrations',
    icon: ArrowLeftRight,
    roles: ['ADMIN'],
  },
  {
    title: 'Employees',
    href: '/dashboard/employees',
    icon: Users,
    roles: ['ADMIN', 'MANAGER'],
  },
  {
    title: 'Payments',
    href: '/dashboard/payments',
    icon: DollarSign,
    roles: ['EMPLOYEE'],
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
    roles: ['ADMIN'],
  },
];

//   // const { data: session, status } = useSession();
//   const pathname = usePathname();

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: any;
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
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

            // Skip rendering if user's role is not in item's roles
            if (!item.roles.includes(user?.role)) {
              return null;
            }

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
        </nav>
      </SidebarContent>
      <SidebarFooter>
        <div className="p-1">
          <SidebarOptInForm />
        </div>
        <div className="p-1">
          <NavUser {...user} />
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
