'use server';

import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { ActivityLog } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';

export async function getActivityLogs(page = 1, limit = 10, filter = '') {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user;

    if (!user) {
      throw new Error('Unauthorized access');
    }

    const skip = (page - 1) * limit;

    // Build the base filter
    let where: any = filter
      ? {
          OR: [
            { action: { contains: filter, mode: 'insensitive' as const } },
            { description: { contains: filter, mode: 'insensitive' as const } },
            {
              user: {
                name: { contains: filter, mode: 'insensitive' as const },
              },
            },
          ],
        }
      : {};

    // Add user-specific filter for non-admin/manager roles
    if (user?.role !== 'ADMIN' && user?.role !== 'MANAGER') {
      where = {
        ...where,
        userId: user?.id,
      };
    }

    // Get total count for pagination
    const totalLogs = await db.activityLog.count({ where });

    // Fetch logs with user data - same query for all roles, just with different where clauses
    const logs = await db.activityLog.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limit,
    });

    // Calculate total pages
    const totalPages = Math.ceil(totalLogs / limit);

    return {
      logs: logs as ActivityLog[],
      totalPages,
      currentPage: page,
    };
  } catch (error) {
    console.error('Error fetching activity logs:', error);
    throw new Error('Failed to fetch activity logs');
  }
}

export async function createActivityLog(data: any) {
  try {
    const log = await db.activityLog.create({
      data: {
        ...data,
      },
    });

    revalidatePath('/dashboard/activity-log');
    return log;
  } catch (error) {
    console.error('Error creating activity log:', error);
    throw new Error('Failed to create activity log');
  }
}

export async function deleteActivityLog(id: string) {
  try {
    await db.activityLog.delete({
      where: { id },
    });

    revalidatePath('/dashboard/activity-log');
    return { success: true };
  } catch (error) {
    console.error('Error deleting activity log:', error);
    throw new Error('Failed to delete activity log');
  }
}

export async function clearActivityLogs() {
  try {
    await db.activityLog.deleteMany({});

    revalidatePath('/dashboard/activity-log');
    return { success: true };
  } catch (error) {
    console.error('Error clearing activity logs:', error);
    throw new Error('Failed to clear activity logs');
  }
}
