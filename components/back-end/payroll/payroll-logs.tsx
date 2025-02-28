'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { ActivityLog } from '@prisma/client';

// This would come from your API in a real app
const mockLogs = [
  {
    id: '1',
    action: 'CREATED',
    description: 'Payroll was created',
    timestamp: '2024-02-15T10:00:00Z',
    user: {
      name: 'Jane Smith',
      avatar: null,
      role: 'HR Manager',
    },
  },
  {
    id: '2',
    action: 'UPDATED',
    description: 'Updated payment amount',
    timestamp: '2024-02-15T10:05:00Z',
    user: {
      name: 'Jane Smith',
      avatar: null,
      role: 'HR Manager',
    },
  },
  {
    id: '3',
    action: 'APPROVED',
    description: 'Payroll was approved',
    timestamp: '2024-02-15T11:30:00Z',
    user: {
      name: 'John Wilson',
      avatar: null,
      role: 'Finance Director',
    },
  },
  {
    id: '4',
    action: 'PROCESSED',
    description: 'Payment was processed',
    timestamp: '2024-02-15T14:00:00Z',
    user: {
      name: 'System',
      avatar: null,
      role: 'Automated Process',
    },
  },
];

interface PayrollLogsProps {
  activityLogs: (ActivityLog & { user: any })[];
}

export function PayrollLogs({ activityLogs }: PayrollLogsProps) {
  const getActionColor = (action: string) => {
    switch (action.toLowerCase()) {
      case 'created':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
      case 'updated':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
      case 'approved':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'processed':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Log</CardTitle>
        <CardDescription>
          Track all activities related to this payroll
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-border" />

          <div className="space-y-6">
            {activityLogs.map((log, index) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-4"
              >
                <Avatar className="h-12 w-12 border-4 border-background">
                  <AvatarImage src={log.user.avatar || undefined} />
                  <AvatarFallback>
                    {log.user.name
                      .split(' ')
                      .map((n: any) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      className={getActionColor(log.action)}
                    >
                      {log.action}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(log.createdAt), 'PPp')}
                    </span>
                  </div>
                  <p className="text-sm line-clamp-2">{log.description}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{log.user.name}</span>
                    <span>•</span>
                    <span>{log.user.role}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
