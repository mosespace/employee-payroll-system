'use server';

import { z } from 'zod';
import { db } from '@/lib/db';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';

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

  try {
    // Get the authenticated user
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return { status: 500, message: 'Unauthorized access. Please log in.' };
    }

    // Fetch the payment record
    const paymentRecord = await db.paymentRecord.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        employee: true,
      },
    });

    const activityLogs = await db.activityLog.findMany({
      where: {
        details: {
          path: ['employeeId'],
          equals: paymentRecord[0]?.employeeId || '',
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
  } catch (error) {
    console.error('Error creating payroll:', error);
    return {
      message: 'Failed to fetch payroll. Please try again.',
    };
  }
}
