import { getEmployees } from '@/actions/employees';
import { getPayRollById } from '@/actions/payroll';
import CreatePayrollForm from '@/components/back-end/employee-forms/create-payroll-form';

type Params = Promise<{ id: string }>;

export default async function PayrollPage({ params }: { params: Params }) {
  const { id } = await params;
  const payrollData = await getPayRollById({ employeeId: id });
  const payroll = payrollData?.data;
  const activityLogs = payrollData?.data?.activityLogs;

  const employees_data = await getEmployees();
  const employees = employees_data?.data;

  // console.log('Payroll ✅:', payroll);

  return (
    <div className="container mx-auto py-8 px-4">
      {/* <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <PayrollDetails payroll={payroll} />
          <PayrollLogs activityLogs={activityLogs as any} />
        </div>
        <div>
          <PayrollActions payroll={mockPayrollData} />
        </div>
      </div> */}

      <CreatePayrollForm payroll={payroll} employees={employees as any} />
    </div>
  );
}
