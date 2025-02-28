import { AttendanceTable } from '@/components/back-end/attendance-table';

export default function AdminAttendancePage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-2">Clock In/Out</h1>
      <p className="text-muted-foreground mb-8">
        View and manage employee attendance records
      </p>

      <AttendanceTable />
    </div>
  );
}
