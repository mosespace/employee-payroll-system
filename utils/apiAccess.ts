// src/utils/ipAccess.js

import { isIpInRange } from '@/utils/checkIpInRange';
import { notFound } from 'next/navigation';
import { headers } from 'next/headers';

/**
 * Check if the client IP is allowed to access the route
 * Works in both development and production
 */
export async function checkIpAccess() {
  const headersList = await headers();
  const forwardedIp = headersList.get('x-forwarded-for') || '';
  const clientIp = forwardedIp.split(',')[0].trim() || '0.0.0.0';

  console.log('Client IP detected:', clientIp);

  // Development mode - allow localhost access
  if (process.env.NODE_ENV === 'development') {
    console.log('Development mode - allowing access');
    return true;
  }

  // Production mode - check IP against allowed networks
  const allowedNetworks = [
    '192.168.1.0/24', // Your local network
    // Add more networks as needed for production
  ];

  // Check if the IP is in any allowed network
  const isAllowed = allowedNetworks.some((network) => {
    const result = isIpInRange(clientIp, network);
    console.log(`Checking ${clientIp} against ${network}: ${result}`);
    return result;
  });

  if (!isAllowed) {
    console.log('Access denied for IP:', clientIp);
    notFound();
    return false;
  }

  console.log('Access granted for IP:', clientIp);
  return true;
}
