'use server';

import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { createActivityLog } from './logs';

// Extend the Project model with additional fields
export type ProjectWithDetails = {
  id: string;
  name: string;
  description?: string | null;
  startDate: Date;
  endDate?: Date | null;
  status: string;
  client?: string | null;
  budget?: number | null;
  assignedEmployees?: { id: string; name: string }[];
  progress?: number;
  createdAt: Date;
  updatedAt: Date;
};

export async function getProjects(): Promise<ProjectWithDetails[]> {
  // Fetch projects from database
  const projects = await db.project.findMany({
    orderBy: { startDate: 'desc' },
  });

  // Transform to include additional fields
  return projects.map((project) => ({
    ...project,
    client: 'Client Name', // This would come from a client table in a real app
    budget: Math.floor(Math.random() * 50000) + 10000, // Placeholder
    assignedEmployees: [], // This would come from a project_employees relation
    progress: Math.floor(Math.random() * 100), // Placeholder
  }));
}

export async function getProject(
  id: string,
): Promise<ProjectWithDetails | null> {
  const project = await db.project.findUnique({
    where: { id },
  });

  if (!project) return null;

  return {
    ...project,
    client: 'Client Name', // Placeholder
    budget: Math.floor(Math.random() * 50000) + 10000, // Placeholder
    assignedEmployees: [], // Placeholder
    progress: Math.floor(Math.random() * 100), // Placeholder
  };
}

export async function createProject(formData: any) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user;
    // console.log('Form Data ✅:', formData);

    const req = await db.project.create({
      data: {
        ...formData,
      },
    });

    const data = {
      userId: user?.id,
      action: 'create',
      description: 'Created a project',
      details: {
        projectId: req.id,
        employeeId: req.employeeId,
        status: req.status,
      },
    };
    // create log
    await createActivityLog(data);
    revalidatePath('/dashboard/projects');
    return {
      status: 201,
      message: 'Thanks',
      data: req,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation error:', error.errors);
      return { success: false, errors: error.errors };
    }

    console.error('Failed to create project:', error);
    return { success: false, message: 'Failed to create project' };
  }
}

export async function updateProject(id: string, formData: any) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user;
    const req = await db.project.update({
      where: { id },
      data: {
        ...formData,
      },
    });

    const data = {
      userId: user?.id,
      action: 'update',
      description: 'Updated a project',
      details: {
        projectId: req.id,
        employeeId: req.employeeId,
        status: req.status,
      },
    };
    // create log
    await createActivityLog(data);
    revalidatePath('/dashboard/projects');
    return {
      status: 201,
      message: 'Project updated successfully.',
      data: req,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation error:', error.errors);
      return { success: false, errors: error.errors };
    }

    console.error('Failed to update project:', error);
    return { success: false, message: 'Failed to update project' };
  }
}

export async function deleteProject(id: string) {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  try {
    const req = await db.project.delete({
      where: { id },
    });

    const data = {
      userId: user?.id,
      action: 'deleted',
      description: 'Deleted a project',
      details: {
        projectId: req.id,
        employeeId: req.employeeId,
        status: req.status,
      },
    };
    // create log
    await createActivityLog(data);
    revalidatePath('/dashboard/projects');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete project:', error);
    return { success: false, message: 'Failed to delete project' };
  }
}

export async function getProjectById(id: string) {
  try {
    if (!id) {
      return {
        data: null,
        status: 404,
        message: `The project with id ${id} does not exist in our database`,
      };
    }

    const project = await db.project.findUnique({
      where: { id },
    });
    return {
      data: project,
      status: 200,
      message: `Project with ${id} fetched back successfully`,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Error:', error.errors);
      return { success: false, errors: error.errors };
    }

    console.error('Failed to fetch project:', error);
    return { success: false, message: 'Failed to update project' };
  }
}
