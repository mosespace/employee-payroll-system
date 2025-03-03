import { getPayrollData } from '@/actions/payroll';
import { MetricCard } from '@/components/metric-card';
import { PayrollTable } from '@/components/payroll-table';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

const metrics = [
  {
    title: 'Next Payroll date',
    value: 'Jul 1, 2023',
    type: 'date',
    image: '/dashboard/calendar.png',
  },
  {
    title: 'Total Employee',
    value: '120 (Employees)',
    type: 'employees',
    image: '/dashboard/people.png',
  },
  {
    title: 'Total Working Hours',
    value: '680 (Hours)',
    type: 'hours',
    image: '/dashboard/time.png',
  },
  {
    title: 'Total Unpaid Payroll',
    value: '$120,000',
    type: 'money',
    image: '/dashboard/dollar.png',
  },
] as const;

const payrollData = [
  {
    id: '512623',
    name: 'Alyssa Brown',
    salary: 2000,
    overtime: 500,
    bonuses: 100,
    expenses: 0,
    training: 0,
    totalAddition: 600,
    totalPayroll: 3200,
  },
  {
    id: '512612',
    name: 'Christian Collins',
    salary: 2500,
    overtime: 1000,
    bonuses: 0,
    expenses: 0,
    training: 0,
    totalAddition: 800,
    totalPayroll: 4300,
  },
  {
    id: '512624',
    name: 'John Bush',
    salary: 4500,
    overtime: 1200,
    bonuses: 0,
    expenses: 0,
    training: 500,
    totalAddition: 500,
    totalPayroll: 6700,
  },
  {
    id: '512842',
    name: 'Micah Murphy',
    salary: 5000,
    overtime: 200,
    bonuses: 0,
    expenses: 100,
    training: 0,
    totalAddition: 200,
    totalPayroll: 5500,
  },
  {
    id: '512832',
    name: 'Winston Larson',
    salary: 5000,
    overtime: 1200,
    bonuses: 0,
    expenses: 0,
    training: 0,
    totalAddition: 1000,
    totalPayroll: 7200,
  },
];

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
        <PayrollTable data={payrollData} />
      </div>
    </div>
  );
}
