// import { checkIpAccess } from '@/utils/ipCheck';
import { checkIpAccess } from '@/utils/apiAccess';
import React from 'react';

export default async function page() {
  // Check IP access before rendering
  const res = await checkIpAccess();
  // console.log('Response:', res);

  return <div>Welcome to Network Restricted Route</div>;
}
