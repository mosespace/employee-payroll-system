import { Badge } from '@/components/ui/badge';

export default function StatusColumn({
  row,
  accessorKey,
}: {
  row: any;
  accessorKey: any;
}) {
  const status = row.getValue(`${accessorKey}`);

  return <Badge variant="outline">{status ? 'Active' : 'Disabled'}</Badge>;
}
