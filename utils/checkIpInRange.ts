import ipcidr from 'ip-cidr';

export const isIpInRange = (ip: string, range: string) => {
  const cidr = new ipcidr(range);
  return cidr.contains(ip);
};
