import { getEmployees } from '@/actions/employees';
import CreatePayrollForm from '@/components/back-end/employee-forms/create-payroll-form';

export default async function page() {
  const employees_data = await getEmployees();
  const employees = employees_data?.data;
  // console.log('Employees ✅:', employees);

  return (
    <div className="container items-center justify-center max-w-4xl mx-auto py-6">
      <CreatePayrollForm employees={employees as any} />
    </div>
  );
}
