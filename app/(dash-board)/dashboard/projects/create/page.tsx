import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { getOnlyEmployees } from '@/actions/employees';
import { ProjectForm } from '@/components/back-end/project-form';

export default async function CreateProjectPage() {
  const session = await getServerSession(authOptions);
  const employeesData = await getOnlyEmployees();
  console.log('Employees ✅:', employeesData?.data);

  return (
    <div className="flex-1 p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">Create New Project</h1>
        <p className="text-muted-foreground">Add a new project to the system</p>
      </div>

      <ProjectForm
        employees={employeesData?.data as any}
        user={session?.user}
      />
    </div>
  );
}
