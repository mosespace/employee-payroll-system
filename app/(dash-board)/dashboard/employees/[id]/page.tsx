import { getEmployeeById, getManagersAndAdmins } from '@/actions/employees';
import EmployeeEditForm from '@/components/back-end/employee-forms/employee-edit-form';

type Params = Promise<{ id: string }>;

export default async function EmployeeDetailsPage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;

  const employee = await getEmployeeById(id);
  const managersAndAdminsData = await getManagersAndAdmins();
  const managersAndAdmins = managersAndAdminsData?.data;

  const adminOptions = managersAndAdmins?.map((ad) => ({
    value: ad.id,
    label: ad.name,
  }));

  return (
    <EmployeeEditForm
      employee={employee.data}
      managersAndAdmins={adminOptions as any}
    />
  );
}
