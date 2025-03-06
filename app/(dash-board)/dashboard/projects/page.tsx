import { getEmployeeProjects } from '@/actions/employees';
import { getProjects } from '@/actions/projects';
import { Button } from '@/components/ui/button';
import { authOptions } from '@/lib/auth';
import { Plus } from 'lucide-react';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { ProjectsTable } from './projects-table';

export default async function ProjectsPage() {
  const session = await getServerSession(authOptions);
  const userRole = session?.user?.role;

  // Get projects based on user role
  let projects;
  if (userRole === 'ADMIN' || userRole === 'MANAGER') {
    projects = await getProjects();
  } else {
    const projectsData = await getEmployeeProjects(session?.user?.id as string);
    projects = projectsData?.data?.projects;
  }

  // Handle the case where projects might be undefined
  const projectsList = projects || [];

  // Calculate statistics
  const activeProjects = projectsList.filter(
    (p) => p.status === 'ONGOING',
  ).length;
  const completedProjects = projectsList.filter(
    (p) => p.status === 'COMPLETED',
  ).length;
  const totalRevenue = projectsList.reduce(
    (sum, project) => sum + (project.budget || 0),
    0,
  );

  return (
    <div className="flex-1 p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold">Projects</h1>

        <Button asChild>
          <Link href="/dashboard/projects/create">
            <Plus className="mr-2 h-4 w-4" />
            Add New Project
          </Link>
        </Button>
      </div>

      <div className="grid gap-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg border p-6 shadow-sm">
            <h3 className="text-lg font-medium mb-2">Active Projects</h3>
            <p className="text-3xl font-bold text-blue-600">{activeProjects}</p>
          </div>
          <div className="bg-white rounded-lg border p-6 shadow-sm">
            <h3 className="text-lg font-medium mb-2">Completed Projects</h3>
            <p className="text-3xl font-bold text-green-600">
              {completedProjects}
            </p>
          </div>
          <div className="bg-white rounded-lg border p-6 shadow-sm">
            <h3 className="text-lg font-medium mb-2">Total Revenue</h3>
            <p className="text-3xl font-bold text-purple-600">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'UGX',
              }).format(totalRevenue)}
            </p>
          </div>
        </div>

        <ProjectsTable projects={projectsList} />
      </div>
    </div>
  );
}
