'use server';

import { db } from '@/lib/db';

export async function getPaymentStats(userId: string) {
  try {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();

    // Get current month paymentRecord
    const currentMonthPayment = await db.paymentRecord.findFirst({
      where: {
        employeeId: userId,
        createdAt: {
          gte: new Date(currentYear, currentMonth, 1),
          lt: new Date(currentYear, currentMonth + 1, 1),
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Get year to createdAt total
    const yearToDatePayments = await db.paymentRecord.findMany({
      where: {
        employeeId: userId,
        createdAt: {
          gte: new Date(currentYear, 0, 1),
          lt: new Date(currentYear + 1, 0, 1),
        },
      },
    });

    const yearToDateTotal = yearToDatePayments.reduce(
      (sum, paymentRecord) => sum + paymentRecord.amount,
      0,
    );
    const yearToDateAverage = yearToDateTotal / (currentMonth + 1);

    // Get last year's total for comparison
    const lastYearPayments = await db.paymentRecord.findMany({
      where: {
        employeeId: userId,
        createdAt: {
          gte: new Date(currentYear - 1, 0, 1),
          lt: new Date(currentYear, 0, 1),
        },
      },
    });

    const lastYearTotal = lastYearPayments.reduce(
      (sum, paymentRecord) => sum + paymentRecord.amount,
      0,
    );
    const increase =
      (((yearToDateTotal / (currentMonth + 1)) * 12 - lastYearTotal) /
        lastYearTotal) *
      100;

    // Get next paymentRecord estimate (based on last paymentRecord)
    const lastPayment = await db.paymentRecord.findFirst({
      where: {
        employeeId: userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const nextPaymentDate = lastPayment
      ? new Date(lastPayment.createdAt)
      : new Date();
    nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);

    return {
      success: true,
      data: {
        currentMonth: {
          paid: !!currentMonthPayment,
          amount: currentMonthPayment?.amount || lastPayment?.amount || 0,
          createdAt: currentMonthPayment?.createdAt.toISOString() || null,
          status: currentMonthPayment || lastPayment?.status,
        },
        yearToDate: {
          total: yearToDateTotal,
          average: yearToDateAverage,
          increase: increase,
        },
        nextPayment: {
          estimated: nextPaymentDate.toISOString(),
          amount: lastPayment?.amount || 0,
        },
      },
    };
  } catch (error) {
    console.error('Error fetching paymentRecord stats:', error);
    return {
      success: false,
      error: 'Failed to fetch paymentRecord statistics',
    };
  }
}

export async function getPaymentHistory({
  userId,
  searchQuery,
  month,
  year,
  page = 1,
  limit = 10,
}: {
  userId: string;
  searchQuery?: string;
  month?: string;
  year?: string;
  page?: number;
  limit?: number;
}) {
  try {
    const where: any = {
      employeeId: userId,
    };

    // Add createdAt filters
    if (year && year !== 'all') {
      const yearStart = new Date(Number.parseInt(year), 0, 1);
      const yearEnd = new Date(Number.parseInt(year) + 1, 0, 1);
      where.createdAt = {
        gte: yearStart,
        lt: yearEnd,
      };

      if (month && month !== 'all') {
        const monthNum = Number.parseInt(month) - 1;
        where.createdAt = {
          gte: new Date(Number.parseInt(year), monthNum, 1),
          lt: new Date(Number.parseInt(year), monthNum + 1, 1),
        };
      }
    }

    // Add search filter
    if (searchQuery) {
      where.OR = [
        { reference: { contains: searchQuery, mode: 'insensitive' } },
        { type: { contains: searchQuery, mode: 'insensitive' } },
      ];
    }

    // Get paginated results
    const skip = (page - 1) * limit;
    const [payments, total] = await Promise.all([
      db.paymentRecord.findMany({
        where,
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      db.paymentRecord.count({ where }),
    ]);

    return {
      success: true,
      data: payments,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        current: page,
        limit,
      },
    };
  } catch (error) {
    console.error('Error fetching paymentRecord history:', error);
    return { success: false, error: 'Failed to fetch paymentRecord history' };
  }
}

export async function downloadPaymentStatement(
  userId: string,
  year: string,
  month?: string,
) {
  try {
    const where: any = {
      employeeId: userId,
    };

    if (year && year !== 'all') {
      const yearStart = new Date(Number.parseInt(year), 0, 1);
      const yearEnd = new Date(Number.parseInt(year) + 1, 0, 1);
      where.createdAt = {
        gte: yearStart,
        lt: yearEnd,
      };

      if (month && month !== 'all') {
        const monthNum = Number.parseInt(month) - 1;
        where.createdAt = {
          gte: new Date(Number.parseInt(year), monthNum, 1),
          lt: new Date(Number.parseInt(year), monthNum + 1, 1),
        };
      }
    }

    const payments = await db.paymentRecord.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        employee: {
          select: {
            name: true,
            employeeId: true,
          },
        },
      },
    });

    // In a real app, you would generate a PDF or CSV here
    return {
      success: true,
      data: payments,
    };
  } catch (error) {
    console.error('Error downloading statement:', error);
    return {
      success: false,
      error: 'Failed to download paymentRecord statement',
    };
  }
}
