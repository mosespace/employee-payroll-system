import { getPayRollById } from '@/actions/payroll';
import { PayrollActions } from '@/components/back-end/payroll/payroll-actions';
import { PayrollDetails } from '@/components/back-end/payroll/payroll-details';
import { PayrollLogs } from '@/components/back-end/payroll/payroll-logs';

type Params = Promise<{ id: string }>;

export default async function PaymentPage({ params }: { params: Params }) {
  const { id } = await params;
  const employeeId = id;
  const payrollData = await getPayRollById({ employeeId });
  const payroll = payrollData?.data;
  const activityLogs = payrollData?.data?.activityLogs;
  // console.log('Payroll Data✅:', payrollData);

  const action_data = {
    id: payroll?.id || '',
    employee: {
      id: payroll?.employee?.id || '',
      name: payroll?.employee?.name || '',
      position: payroll?.employee?.position || '',
      email: payroll?.employee?.email || '',
      avatar: payroll?.employee?.image || null,
    },
    payment: {
      amount: payroll?.amount || 0,
      currency: 'UGX',
      status: payroll?.status || '',
      date: payroll?.createdAt || '',
      method: payroll?.paymentMethod || '',
      reference: payroll?.reference || '',
    },
    period: {
      start: payroll?.payPeriodStart || '',
      end: payroll?.payPeriodEnd || '',
    },
    breakdown: {
      baseSalary: payroll?.employee?.baseSalary || 0,
      allowances: {
        housing: payroll?.employee?.compensation?.housingAllowance || 0,
        transport: payroll?.employee?.compensation?.transportAllowance || 0,
        meal: payroll?.employee?.compensation?.mealAllowance || 0,
        other: payroll?.employee?.compensation?.otherAllowances || 0,
      },
      deductions: {
        tax: payroll?.employee?.compensation?.taxDeduction || 0,
        insurance: payroll?.employee?.compensation?.insuranceDeduction || 0,
        pension: payroll?.employee?.compensation?.pensionDeduction || 0,
        other: payroll?.employee?.compensation?.otherDeduction || 0,
      },
    },
    createdAt: payroll?.createdAt || '',
    createdBy: {
      id: payroll?.createdBy?.id || '',
      name: payroll?.createdBy?.name || '',
      role: payroll?.createdBy?.role || '',
    },
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <PayrollDetails payroll={payroll as any} />
          <PayrollLogs activityLogs={activityLogs as any} />
        </div>
        <div>
          <PayrollActions payroll={action_data} />
        </div>
      </div>
    </div>
  );
}
