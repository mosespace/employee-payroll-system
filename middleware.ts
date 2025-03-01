import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export const data = [
  {
    href: '/dashboard',
    roles: ['ADMIN', 'EMPLOYEE', 'MANAGER'],
  },
  {
    href: '/dashboard/payroll',
    roles: ['ADMIN', 'MANAGER'],
  },
  {
    href: '/dashboard/attendance',
    roles: ['ADMIN', 'EMPLOYEE', 'MANAGER'],
  },
  {
    href: '/dashboard/integrations',
    roles: ['ADMIN', 'MANAGER', 'EMPLOYEE'],
  },
  {
    href: '/dashboard/employees',
    roles: ['ADMIN', 'MANAGER'],
  },
  {
    href: '/dashboard/payments',
    roles: ['EMPLOYEE'],
  },
  {
    href: '/dashboard/logs',
    roles: ['ADMIN', 'MANAGER', 'EMPLOYEE'],
  },
  {
    href: '/dashboard/settings',
    roles: ['ADMIN', 'MANAGER', 'EMPLOYEE'],
  },
];

// Define allowed roles type
type Role = 'ADMIN' | 'EMPLOYEE' | 'MANAGER';

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip middleware for non-dashboard routes and API routes
  if (!pathname.startsWith('/dashboard') || pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // Get user from session
  const session = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // If no session exists, redirect to login
  if (!session) {
    const url = new URL('/login', request.url);
    url.searchParams.set('callbackUrl', encodeURI(pathname));
    return NextResponse.redirect(url);
  }

  // Get user role from session (adjust according to your session structure)
  const userRole = session.role as Role;

  if (!userRole) {
    // If user has no role defined, redirect to unauthorized page
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  // Find the matching route in your navigation data
  const matchedRoute = data.find((route: any) => {
    // Check exact match or if this is a sub-route
    return (
      pathname === route.href ||
      (pathname.startsWith(route.href + '/') && route.href !== '/dashboard')
    );
  });

  // If no matching route definition found but still under /dashboard,
  // allow access only if user can access dashboard
  if (!matchedRoute && pathname !== '/dashboard') {
    const dashboardRoute = data.find((route) => route.href === '/dashboard');
    if (dashboardRoute && !dashboardRoute.roles.includes(userRole)) {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
    return NextResponse.next();
  }

  // For dashboard base route or matched routes, check role permissions
  if (matchedRoute && !matchedRoute.roles.includes(userRole)) {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  // User has permission, proceed
  return NextResponse.next();
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    // Match all dashboard routes
    '/dashboard/:path*',
  ],
};
