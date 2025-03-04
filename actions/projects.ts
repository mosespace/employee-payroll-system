'use server';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

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

// Schema for project creation/update
const projectSchema = z.object({
  name: z.string().min(3, 'Project name must be at least 3 characters'),
  description: z.string().optional(),
  startDate: z.string().transform((str) => new Date(str)),
  endDate: z
    .string()
    .optional()
    .transform((str) => (str ? new Date(str) : undefined)),
  status: z.enum(['ONGOING', 'COMPLETED', 'CANCELLED']),
  client: z.string().optional(),
  budget: z.coerce.number().optional(),
  assignedEmployeeIds: z.array(z.string()).optional(),
});

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

export async function createProject(formData: FormData) {
  const data = Object.fromEntries(formData.entries());

  // Handle array of assigned employees
  const assignedEmployeeIds = formData.getAll(
    'assignedEmployeeIds',
  ) as string[];

  try {
    const validatedData = projectSchema.parse({
      ...data,
      assignedEmployeeIds,
    });

    await db.project.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        startDate: validatedData.startDate,
        endDate: validatedData.endDate,
        status: validatedData.status,
        // In a real app, you would create relations to clients and employees
      },
    });

    revalidatePath('/dashboard/projects');
    redirect('/dashboard/projects');
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation error:', error.errors);
      return { success: false, errors: error.errors };
    }

    console.error('Failed to create project:', error);
    return { success: false, message: 'Failed to create project' };
  }
}

export async function updateProject(id: string, formData: FormData) {
  const data = Object.fromEntries(formData.entries());

  // Handle array of assigned employees
  const assignedEmployeeIds = formData.getAll(
    'assignedEmployeeIds',
  ) as string[];

  try {
    const validatedData = projectSchema.parse({
      ...data,
      assignedEmployeeIds,
    });

    await db.project.update({
      where: { id },
      data: {
        name: validatedData.name,
        description: validatedData.description,
        startDate: validatedData.startDate,
        endDate: validatedData.endDate,
        status: validatedData.status,
        // In a real app, you would update relations to clients and employees
      },
    });

    revalidatePath('/dashboard/projects');
    redirect('/dashboard/projects');
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
  try {
    await db.project.delete({
      where: { id },
    });

    revalidatePath('/dashboard/projects');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete project:', error);
    return { success: false, message: 'Failed to delete project' };
  }
}
