'use client';

import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ChevronDownIcon, ChevronUpIcon, UserIcon } from 'lucide-react';
import { useState } from 'react';

interface ActivityLogItemProps {
  log: any;
}

export function ActivityLogItem({ log }: ActivityLogItemProps) {
  const [expanded, setExpanded] = useState(false);

  // Format the timestamp
  const formattedDate = format(
    new Date(log.createdAt),
    'MMM dd, yyyy HH:mm:ss',
  );

  // Determine badge color based on action type
  const getBadgeVariant = (action: string) => {
    const actionLower = action.toLowerCase();
    if (actionLower.includes('create') || actionLower.includes('add'))
      return 'default';
    if (actionLower.includes('delete') || actionLower.includes('remove'))
      return 'destructive';
    if (actionLower.includes('update') || actionLower.includes('edit'))
      return 'secondary';
    if (actionLower.includes('login') || actionLower.includes('auth'))
      return 'secondary';
    if (actionLower.includes('reset-password') || actionLower.includes('auth'))
      return 'secondary';
    return 'outline';
  };

  return (
    <div className="border-b last:border-0">
      <div
        className="grid grid-cols-12 px-4 py-3 hover:bg-muted/50 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="col-span-5 md:col-span-3 text-sm">{formattedDate}</div>
        <div className="col-span-3 hidden md:flex items-center gap-2 text-sm">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10">
            <UserIcon className="h-4 w-4 text-primary" />
          </div>
          <span className="truncate">{log.user?.name || 'Unknown User'}</span>
        </div>
        <div className="col-span-4 md:col-span-3 flex items-center">
          <Badge variant={getBadgeVariant(log.action)}>{log.action}</Badge>
        </div>
        <div className="col-span-3 hidden md:block text-sm text-muted-foreground truncate">
          {log.description || 'No description'}
        </div>
        <div className="col-span-3 md:hidden flex justify-end">
          {expanded ? (
            <ChevronUpIcon className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDownIcon className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </div>

      {expanded && (
        <div className="px-4 py-3 bg-muted/50 text-sm">
          <div className="md:hidden mb-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10">
                <UserIcon className="h-4 w-4 text-primary" />
              </div>
              <span>{log.user?.name || 'Unknown User'}</span>
            </div>
            <div className="text-muted-foreground mb-2">
              {log.description || 'No description'}
            </div>
          </div>

          {log.details && (
            <div className="space-y-2">
              <h4 className="font-medium">Details</h4>
              <div className="rounded-md bg-muted p-3 font-mono text-xs">
                <pre className="whitespace-pre-wrap break-all">
                  {JSON.stringify(log.details, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
