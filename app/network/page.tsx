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
  const headersList = await headers();
  const forwardedIp = headersList.get('x-forwarded-for') || '';
  const clientIp = forwardedIp.split(',')[0].trim() || '::1';

  console.log('Client IP:', clientIp);

  // Define allowed IPs and ranges
  const allowedAddresses = [
    '192.168.1.0/24', // Your local network
    '127.0.0.1', // IPv4 localhost
    '::1', // IPv6 localhost
    // Add your public IP here for production testing
  ];

  // Check if client IP is allowed
  const isAllowed = isIpFromAllowedRange(clientIp, allowedAddresses);

  if (!isAllowed) {
    console.log('Not allowed to access:', clientIp);
    notFound();
  }
}

// Helper function to check if IP is in allowed ranges
function isIpFromAllowedRange(ip: any, allowedRanges: any) {
  // Special case: directly allow localhost during development
  if (ip === '::1' || ip === '127.0.0.1') {
    console.log('Allowing localhost access');
    return true;
  }

  // Check against all allowed ranges
  return allowedRanges.some((range: any) => isIpInRange(ip, range));
}
