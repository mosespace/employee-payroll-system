'use server';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function clockIn(userId: string) {
  try {
    // Check if user already has an open attendance record for today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const existingRecord = await db.attendance.findFirst({
      where: {
        employeeId: userId,
        date: {
          gte: today,
          lt: tomorrow,
        },
        checkOutTime: null,
      },
    });

    if (existingRecord) {
      return { success: false, message: 'You are already clocked in' };
    }

    // Create new attendance record
    const attendance = await db.attendance.create({
      data: {
        employeeId: userId,
        checkInTime: new Date(),
        date: new Date(),
      },
    });

    // Update user's checkInTime
    await db.user.update({
      where: { id: userId },
      data: { checkInTime: new Date() },
    });

    revalidatePath('/dashboard');
    revalidatePath('/admin/attendance');

    return { success: true, data: attendance };
  } catch (error) {
    console.error('Clock in error:', error);
    return { success: false, message: 'Failed to clock in' };
  }
}

export async function clockOut(userId: string) {
  try {
    // Find the latest open attendance record
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const latestRecord = await db.attendance.findFirst({
      where: {
        employeeId: userId,
        date: {
          gte: today,
          lt: tomorrow,
        },
        checkOutTime: null,
      },
      orderBy: {
        checkInTime: 'desc',
      },
    });

    if (!latestRecord) {
      return { success: false, message: 'No active clock-in found' };
    }

    const checkOutTime = new Date();
    const totalHours =
      (checkOutTime.getTime() - latestRecord.checkInTime.getTime()) /
      (1000 * 60 * 60);

    // Update attendance record
    const updatedAttendance = await db.attendance.update({
      where: { id: latestRecord.id },
      data: {
        checkOutTime,
        totalHours,
      },
    });

    // Update user's checkOutTime
    await db.user.update({
      where: { id: userId },
      data: { checkOutTime },
    });

    revalidatePath('/dashboard');
    revalidatePath('/admin/attendance');

    return { success: true, data: updatedAttendance };
  } catch (error) {
    console.error('Clock out error:', error);
    return { success: false, message: 'Failed to clock out' };
  }
}

export async function getAttendanceRecords({
  date,
  employeeId,
  searchQuery,
  page = 1,
  limit = 10,
}: {
  date?: Date;
  employeeId?: string;
  searchQuery?: string;
  page?: number;
  limit?: number;
}) {
  try {
    const skip = (page - 1) * limit;

    // Build the where clause
    const where: any = {};

    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);

      where.date = {
        gte: startDate,
        lte: endDate,
      };
    }

    if (employeeId) {
      where.employeeId = employeeId;
    }

    if (searchQuery) {
      where.employee = {
        OR: [
          { name: { contains: searchQuery, mode: 'insensitive' } },
          { email: { contains: searchQuery, mode: 'insensitive' } },
          { employeeId: { contains: searchQuery, mode: 'insensitive' } },
        ],
      };
    }

    // Get records with pagination
    const records = await db.attendance.findMany({
      where,
      include: {
        employee: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            employeeId: true,
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
      skip,
      take: limit,
    });

    // Get total count for pagination
    const totalCount = await db.attendance.count({ where });

    return {
      success: true,
      data: records,
      pagination: {
        total: totalCount,
        pages: Math.ceil(totalCount / limit),
        current: page,
        limit,
      },
    };
  } catch (error) {
    console.error('Get attendance records error:', error);
    return { success: false, message: 'Failed to fetch attendance records' };
  }
}

export async function getMonthlyAttendance(
  year: number,
  month: number,
  employeeId?: string,
) {
  try {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    const where: any = {
      date: {
        gte: startDate,
        lte: endDate,
      },
    };

    if (employeeId) {
      where.employeeId = employeeId;
    }

    const records = await db.attendance.findMany({
      where,
      include: {
        employee: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            employeeId: true,
          },
        },
      },
      orderBy: {
        date: 'asc',
      },
    });

    return { success: true, data: records };
  } catch (error) {
    console.error('Get monthly attendance error:', error);
    return { success: false, message: 'Failed to fetch monthly attendance' };
  }
}

export async function getCurrentAttendanceStatus(userId: string) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const latestRecord = await db.attendance.findFirst({
      where: {
        employeeId: userId,
        date: {
          gte: today,
          lt: tomorrow,
        },
      },
      orderBy: {
        checkInTime: 'desc',
      },
    });

    if (!latestRecord) {
      return { success: true, data: { status: 'NOT_CHECKED_IN' } };
    }

    if (latestRecord.checkOutTime) {
      return {
        success: true,
        data: {
          status: 'CHECKED_OUT',
          checkInTime: latestRecord.checkInTime,
          checkOutTime: latestRecord.checkOutTime,
          totalHours: latestRecord.totalHours,
        },
      };
    }

    return {
      success: true,
      data: {
        status: 'CHECKED_IN',
        checkInTime: latestRecord.checkInTime,
      },
    };
  } catch (error) {
    console.error('Get attendance status error:', error);
    return { success: false, message: 'Failed to fetch attendance status' };
  }
}
