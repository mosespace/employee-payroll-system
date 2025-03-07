import { getPayrollData } from '@/actions/payroll';
import { MetricCard } from '@/components/metric-card';
import { PayrollTable } from '@/components/payroll-table';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default async function PayrollDashboard() {
  const { payrollData, metrics } = await getPayrollData();

  return (
    <div className="flex-1 p-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 mb-8">
          <button className="text-muted-foreground">
            <ChevronRight />
          </button>
          <h1 className="text-2xl font-semibold">Payroll Report</h1>
        </div>
        <Button asChild>
          <Link href="/dashboard/payroll/create">Add New Payroll</Link>
        </Button>
      </div>
      <div className="mb-8">
        <h2 className="text-lg font-medium mb-2">Menu Access</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Select menu to process further
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric) => (
            <MetricCard key={metric.title} {...metric} />
          ))}
        </div>
      </div>
      <div>
        <h2 className="text-lg font-medium mb-2">Payroll Details</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Employee payroll details
        </p>
        <PayrollTable data={payrollData as any} />
      </div>
    </div>
  );
}
