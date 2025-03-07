import { getEmployees } from '@/actions/employees';
import { getPayRollById } from '@/actions/payroll';
import CreatePayrollForm from '@/components/back-end/employee-forms/create-payroll-form';

type Params = Promise<{ id: string }>;

export default async function PayrollPage({ params }: { params: Params }) {
  const { id } = await params;
  const payrollData = await getPayRollById({ employeeId: id });
  const payroll = payrollData?.data;

  const employees_data = await getEmployees();
  const employees = employees_data?.data;

  // console.log('Payroll ✅:', payroll);

  return (
    <div className="container mx-auto py-8 px-4">
      <CreatePayrollForm payroll={payroll} employees={employees as any} />
    </div>
  );
}
