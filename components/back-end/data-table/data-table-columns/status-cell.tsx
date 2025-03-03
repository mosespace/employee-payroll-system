'use client';

import { useState, useTransition } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { toast } from '@mosespace/toast';
import { updateEmployee } from '@/actions/employees';

interface StatusCellProps {
  id: string;
  initialStatus: any;
  model: string;
  statusStyles?: any;
  options?: any;
}

export function StatusCell({
  id,
  initialStatus,
  model,
  options,
  statusStyles = {},
}: StatusCellProps) {
  const [status, setStatus] = useState(initialStatus);
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (newStatus: any) => {
    try {
      startTransition(async () => {
        setStatus(newStatus); // Optimistic update
        const result: any =
          model === 'employee' ? (
            await updateEmployee(id, newStatus)
          ) : model === 'payment' ? (
            <></>
          ) : // await updatePaymentStatus(id, newStatus)
          null;
        if (result?.success) {
          toast.success('Success', `${result.message}`);
        } else {
          setStatus(initialStatus);
          toast.error('Error', `${result?.message}`);
        }
      });
    } catch (error) {
      console.log('Something Failed', error);
      toast.error('Error', 'Failed to update status');
    } finally {
    }
  };

  return (
    <div className="px-4 py-2">
      <Select
        disabled={isPending}
        value={status}
        onValueChange={(value) => handleStatusChange(value as any)}
      >
        <SelectTrigger
          className={cn(
            'w-[140px] justify-center rounded-none font-semibold',
            statusStyles[status],
          )}
        >
          <SelectValue>{isPending ? 'Updating...' : status}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {options.map((status: any) => (
            <SelectItem key={status} value={status}>
              {status.charAt(0) + status.slice(1).toLowerCase()}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
