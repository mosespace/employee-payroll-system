import { isIpInRange } from '@/utils/checkIpInRange';
import { notFound } from 'next/navigation';
import React from 'react';
import { headers } from 'next/headers';

// This needs to be a Server Component
export default async function Page() {
  // Call the IP check function before rendering the page
  await checkIpAccess();

  return <div>Welcome to Network Restricted Route</div>;
}

// IP check function
async function checkIpAccess() {
  // Skip IP check in development
  if (process.env.NODE_ENV === 'development') {
    return;
  }

  const headersList = await headers();
  const ip = headersList.get('x-forwarded-for') || '0.0.0.0';
  const targetRange = '192.168.1.0/24';
  const isAllowed = isIpInRange(ip, targetRange);
  if (!isAllowed) {
    console.log('Not allowed to access:', ip);
    notFound();
  }
}
