'use server';

import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { formatCurrency } from '@/utils/formatCurrency';
import { PaymentRecord } from '@prisma/client';
import { endOfMonth, format, startOfMonth } from 'date-fns';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// Define the schema for the payroll form validation
const payrollFormSchema = z.object({
  employeeId: z.string().min(1, { message: 'Please select an employee.' }),
  paymentMethod: z
    .enum(['BANK_TRANSFER', 'STRIPE', 'MOBILE_MONEY', 'CHECK'])
    .default('BANK_TRANSFER'),
  status: z.enum(['PENDING', 'COMPLETED', 'FAILED']).default('PENDING'),
  paymentDate: z.date(),
  transactionId: z.string().optional(),
  payPeriodStart: z.date(),
  payPeriodEnd: z.date(),
  baseSalary: z
    .number()
    .min(0, { message: 'Base salary must be a positive number.' }),
  housingAllowance: z.number().min(0).default(0),
  transportAllowance: z.number().min(0).default(0),
  mealAllowance: z.number().min(0).default(0),
  otherAllowances: z.number().min(0).default(0),
  taxDeductions: z.number().min(0).default(0),
  insuranceDeduction: z.number().min(0).default(0),
  pensionDeduction: z.number().min(0).default(0),
  otherDeductions: z.number().min(0).default(0),
  description: z.string().optional(),
});

export type PayrollFormValues = z.infer<typeof payrollFormSchema>;

export async function createPayroll(formData: PayrollFormValues) {
  // console.log('FormData ✅:', formData);

  try {
    // Get the authenticated user
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return { status: 500, message: 'Unauthorized access. Please log in.' };
    }

    // Calculate the total earnings
    const totalEarnings =
      formData.baseSalary +
      formData.housingAllowance +
      formData.transportAllowance +
      formData.mealAllowance +
      formData.otherAllowances;

    // Calculate the total deductions
    const totalDeductions =
      formData.taxDeductions +
      formData.insuranceDeduction +
      formData.pensionDeduction +
      formData.otherDeductions;

    // Calculate the net amount
    const netAmount = totalEarnings - totalDeductions;

    // Create the payment record
    const paymentRecord = await db.paymentRecord.create({
      data: {
        employeeId: formData.employeeId,
        amount: totalEarnings,
        paymentMethod: formData.paymentMethod as any,
        paymentDate: formData.paymentDate,
        payPeriodStart: formData.payPeriodStart,
        payPeriodEnd: formData.payPeriodEnd,
        description: formData.description || '',
        transactionId: formData.transactionId,
        status: formData.status,
        taxDeductions: formData.taxDeductions,
        otherDeductions: totalDeductions - formData.taxDeductions, // Combined other deductions
        netAmount: netAmount,
        createdById: session.user.id,
      },
    });

    // Create an activity log entry
    await db.activityLog.create({
      data: {
        userId: session.user.id,
        action: 'created',
        description: 'Made some updates to the payroll',
        details: {
          paymentId: paymentRecord.id,
          employeeId: formData.employeeId,
          amount: netAmount,
        },
      },
    });

    // Revalidate the payroll list page
    revalidatePath('/dashboard/payroll');

    return {
      status: 200,
      message: 'Payroll created successfully',
      data: paymentRecord,
    };
  } catch (error) {
    console.error('Error creating payroll:', error);
    return {
      message: 'Failed to create payroll. Please try again.',
      // details: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function getPayRollById(id: string) {
  // console.log('Id ✅:', id);

  if (!id) {
    return {
      status: 404,
      message: 'Please provide id',
      data: null,
    };
  }

  try {
    // Get the authenticated user
    const session = await getServerSession(authOptions);

    if (!session) {
      return { status: 500, message: 'Unauthorized access. Please log in.' };
    }

    // Fetch the payment record
    const paymentRecord = await db.paymentRecord.findUnique({
      where: {
        id,
      },

      include: {
        createdBy: true,
        employee: {
          include: {
            compensation: true,
          },
        },
      },
    });

    if (!paymentRecord) {
      return {
        status: 500,
        message: 'Please try again later',
        data: null,
      };
    }

    // console.log('Payroll Record✅:', paymentRecord);
    if (paymentRecord) {
      const activityLogs = await db.activityLog.findMany({
        where: {
          details: {
            path: ['employeeId'],
            equals: paymentRecord?.employeeId || '',
          },
        },
        include: {
          user: {
            select: {
              name: true,
              image: true,
              position: true,
              role: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return {
        status: 200,
        message: 'Payroll fetched back successfully',
        data: { ...paymentRecord, activityLogs },
      };
    }
  } catch (error) {
    console.error('Error creating payroll:', error);
    return {
      message: 'Failed to fetch payroll. Please try again.',
    };
  }
}

export async function getPayrollData() {
  // Get current month's date range
  const currentDate = new Date();
  const startDate = startOfMonth(currentDate);
  const endDate = endOfMonth(currentDate);

  // Fetch employees with their payment records
  const employees = await db.user.findMany({
    where: {
      role: { in: ['EMPLOYEE'] },
      employmentStatus: { in: ['ACTIVE', 'PROBATION'] },
    },
    include: {
      paymentRecords: {
        where: {
          payPeriodStart: { gte: startDate },
          payPeriodEnd: { lte: endDate },
        },
        orderBy: { paymentDate: 'desc' },
        take: 1,
      },
      bonuses: {
        where: {
          date: { gte: startDate, lte: endDate },
        },
      },
      compensation: true,
    },
  });

  // Transform data for the PayrollTable
  const payrollData = employees.map((employee) => {
    // Calculate base salary from compensation or use default
    const baseSalary = employee.compensation?.baseSalary
      ? Number.parseFloat(employee.compensation.baseSalary)
      : employee.baseSalary || 0;

    // Get latest payment record if exists
    const latestPayment = employee.paymentRecords[0] || null;

    // Calculate overtime from payment record
    const overtime = latestPayment
      ? latestPayment.amount - baseSalary > 0
        ? latestPayment.amount - baseSalary
        : 0
      : 0;

    // Sum all bonuses for the period
    const bonuses = employee.bonuses.reduce(
      (sum, bonus) => sum + bonus.amount,
      0,
    );

    // Get expenses and training from payment record
    const expenses = latestPayment?.benefits || 0;
    const training = 0; // Assuming no training data in schema

    // Calculate total additions
    const totalAddition = overtime + bonuses + expenses;

    // Calculate total payroll
    const totalPayroll = baseSalary + totalAddition;

    // console.log('Payment ❌', employee.paymentRecords);

    return {
      id: employee.employeeId,
      name: employee.name,
      salary: baseSalary,
      overtime,
      bonuses,
      expenses,
      training,
      totalAddition,
      totalPayroll,
    };
  });

  // Calculate metrics
  const nextPayrollDate = new Date();
  nextPayrollDate.setMonth(nextPayrollDate.getMonth() + 1);
  nextPayrollDate.setDate(1); // First day of next month

  const totalEmployees = employees.length;

  // Calculate total working hours (assuming 8 hours per day, 22 working days)
  const totalWorkingHours = totalEmployees * 8 * 22;

  // Calculate total unpaid payroll
  const totalUnpaidPayroll = payrollData.reduce(
    (sum, employee) => sum + employee.totalPayroll,
    0,
  );

  const metrics = [
    {
      title: 'Next Payroll date',
      value: format(nextPayrollDate, 'MMM d, yyyy'),
      type: 'date',
      image: '/dashboard/calendar.png',
    },
    {
      title: 'Total Employee',
      value: `${totalEmployees} (Employees)`,
      type: 'employees',
      image: '/dashboard/people.png',
    },
    {
      title: 'Total Working Hours',
      value: `${totalWorkingHours} (Hours)`,
      type: 'hours',
      image: '/dashboard/time.png',
    },
    {
      title: 'Total Unpaid Payroll',
      value: formatCurrency(totalUnpaidPayroll),
      type: 'money',
      image: '/dashboard/dollar.png',
    },
  ];

  return { payrollData, metrics };
}

export async function processPayroll(employeeIds: string[]) {
  const currentDate = new Date();
  const startDate = startOfMonth(currentDate);
  const endDate = endOfMonth(currentDate);

  // Create payment records for selected employees
  const results = await Promise.all(
    employeeIds.map(async (employeeId) => {
      const employee = await db.user.findUnique({
        where: { id: employeeId },
        include: { compensation: true },
      });

      if (!employee) return null;

      const baseSalary = employee.compensation?.baseSalary
        ? Number.parseFloat(employee.compensation.baseSalary)
        : employee.baseSalary || 0;

      // Create payment record
      return db.paymentRecord.create({
        data: {
          employeeId,
          amount: baseSalary,
          paymentMethod: employee.preferredPaymentMethod || 'BANK_TRANSFER',
          paymentDate: currentDate,
          payPeriodStart: startDate,
          payPeriodEnd: endDate,
          description: `Salary payment for ${format(startDate, 'MMMM yyyy')}`,
          status: 'PENDING',
          netAmount: baseSalary,
          createdById: 'system', // Replace with actual admin ID
        },
      });
    }),
  );

  return results.filter(Boolean);
}
