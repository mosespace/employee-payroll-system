import { getEmployeeById } from '@/actions/employees';
import EmployeeEditForm from './employee-edit-form';

type Params = Promise<{ id: string }>;

export default async function EmployeeDetailsPage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;

  const employee = await getEmployeeById(id);

  return <EmployeeEditForm employee={employee.data} />;
}
