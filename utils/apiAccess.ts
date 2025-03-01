import { notFound } from 'next/navigation';
import { headers } from 'next/headers';

/**
 * Simple function to check if an IP is in a subnet range
 * Does not rely on external libraries
 */
function isIpInSubnet(ip: any, subnet: any, mask: any) {
  if (!ip || !subnet || !mask) return false;

  try {
    // Convert IP string to array of numbers
    const ipParts = ip.split('.').map((part: any) => parseInt(part, 10));
    // Convert subnet to array of numbers
    const subnetParts = subnet
      .split('.')
      .map((part: any) => parseInt(part, 10));
    // Convert mask to array of numbers
    const maskParts = mask.split('.').map((part: any) => parseInt(part, 10));

    // Check if IP is in the subnet
    for (let i = 0; i < 4; i++) {
      if ((ipParts[i] & maskParts[i]) !== (subnetParts[i] & maskParts[i])) {
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error('Error checking IP in subnet:', error);
    return false;
  }
}

/**
 * Simple IP access check that doesn't rely on external libraries
 */
export async function checkIpAccess() {
  try {
    const headersList = await headers();
    const forwardedIp = headersList.get('x-forwarded-for') || '';
    const clientIp = forwardedIp.split(',')[0].trim() || '0.0.0.0';

    console.log('Client IP detected:', clientIp);

    // Allow in development mode
    if (process.env.NODE_ENV === 'development') {
      console.log('Development mode - allowing access');
      return true;
    }

    // Check allowed subnets (using the simple subnet check function)
    const allowedSubnets = [{ subnet: '192.168.1.0', mask: '255.255.255.0' }];

    for (const { subnet, mask } of allowedSubnets) {
      if (isIpInSubnet(clientIp, subnet, mask)) {
        console.log(`IP ${clientIp} allowed in subnet ${subnet}/${mask}`);
        return true;
      }
    }

    // No permission - block access
    console.log('Access denied for IP:', clientIp);
    notFound();
    return false;
  } catch (error) {
    console.error('Error in IP access check:', error);
    // Fail open for now to prevent lockouts
    return true;
  }
}
