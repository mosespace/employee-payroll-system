import { getEmployees } from '@/actions/employees';
import DataTable from '@/components/back-end/data-table/data-table';
import TableHeader from '@/components/back-end/data-table/data-table-header';
import { columns } from './columns';

export default async function page() {
  const employeesData = await getEmployees();
  const employees = employeesData?.data;

  const searchKeys = ['status', 'seats'];

  return (
    <div className="p-8">
      <TableHeader
        title="All Employees"
        linkTitle="Add Employee"
        data={employees}
        model="employees"
        href="/dashboard/employees/new"
      />
      <div className="py-8">
        <DataTable
          data={employees as any}
          searchKeys={searchKeys}
          columns={columns}
          placeholder="Search Bookings..."
        />
      </div>
    </div>
  );
}
