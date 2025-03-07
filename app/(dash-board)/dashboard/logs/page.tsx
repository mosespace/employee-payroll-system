import { getActivityLogs } from '@/actions/logs';
import { ActivityLogList } from '@/components/back-end/activity-logs/activity-log-list';
import { ActivityLogSkeleton } from '@/components/back-end/activity-logs/activity-log-skeleton';
import { Suspense } from 'react';

export default function ActivityLogPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Activity Log</h1>
        <p className="text-muted-foreground">
          Track all user activities and system events
        </p>
      </div>

      <Suspense fallback={<ActivityLogSkeleton />}>
        <ActivityLogList getLogsAction={getActivityLogs} />
      </Suspense>
    </div>
  );
}
