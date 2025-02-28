import { getPayRollById } from '@/actions/payroll';
import { PayrollLogs } from '@/components/back-end/payroll/payroll-logs';
import { PayrollDetails } from '@/components/back-end/payroll/payroll-details';
import { PayrollActions } from '@/components/back-end/payroll/payroll-actions';

// This would come from your database in a real app
const mockPayrollData = {
  id: 'PAY-2024-001',
  employee: {
    id: '1',
    name: 'John Doe',
    position: 'Software Engineer',
    email: 'john@example.com',
    avatar: null,
  },
  payment: {
    amount: 6500,
    currency: 'USD',
    status: 'COMPLETED',
    date: '2024-02-15',
    method: 'BANK_TRANSFER',
    reference: 'TRX-2024-001',
  },
  period: {
    start: '2024-02-01',
    end: '2024-02-29',
  },
  breakdown: {
    baseSalary: 5000,
    allowances: {
      housing: 800,
      transport: 400,
      meal: 200,
      other: 100,
    },
    deductions: {
      tax: 750,
      insurance: 250,
      pension: 400,
      other: 0,
    },
  },
  createdAt: '2024-02-15T10:00:00Z',
  createdBy: {
    id: 'ADMIN-1',
    name: 'Jane Smith',
    role: 'HR Manager',
  },
};

type Params = Promise<{ id: string }>;

export default async function PayrollPage({ params }: { params: Params }) {
  const { id } = await params;
  const payrollData = await getPayRollById(id);
  const payroll = payrollData?.data;
  const activityLogs = payrollData?.data?.activityLogs;
  // const employee = payroll[0]?.employee;
  // console.log('Activity Logs ✅:', employee);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <PayrollDetails payroll={payroll} />
          <PayrollLogs activityLogs={activityLogs as any} />
        </div>
        <div>
          <PayrollActions payroll={mockPayrollData} />
        </div>
      </div>
    </div>
  );
}
