import { getEmployees } from '@/actions/employees';
import { ProjectForm } from '@/components/back-end/project-form';
import React from 'react';

type Params = Promise<{ id: string }>;

export default async function PayrollPage({ params }: { params: Params }) {
  const { id } = await params;
  const employees = await getEmployees();

  return (
    <div className="flex-1 p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">Create New Project</h1>
        <p className="text-muted-foreground">Add a new project to the system</p>
      </div>

      <ProjectForm employees={employees.data as any} />
    </div>
  );
}
