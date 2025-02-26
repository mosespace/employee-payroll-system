'use server';

import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import bcrypt from 'bcrypt';

const employeeSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  role: z.enum(['ADMIN', 'EMPLOYEE', 'MANAGER']),
  department: z.string().optional(),
  notes: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  confirmPassword: z.string().optional(),
  password: z.string(),
  dateOfBirth: z.date(),
  hireDate: z.date(),
  position: z.string().optional(),
  employmentStatus: z
    .enum(['ACTIVE', 'PROBATION', 'SUSPENDED', 'TERMINATED', 'ON_LEAVE'])
    .optional(),
  baseSalary: z.number().optional(),
  paymentFrequency: z
    .enum(['WEEKLY', 'BIWEEKLY', 'MONTHLY', 'YEARLY'])
    .optional(),
  preferredPaymentMethod: z
    .enum(['BANK_TRANSFER', 'STRIPE', 'MOBILE_MONEY', 'CHECK'])
    .optional(),
  bankAccountDetails: z.record(z.any()).optional(),
  mobileMoneyDetails: z.record(z.any()).optional(),
});

export async function createEmployee(data: z.infer<typeof employeeSchema>) {
  try {
    const session = await getServerSession(authOptions);
    // if (
    //   !session ||
    //   (session.user.role !== 'ADMIN' && session.user.role !== 'MANAGER')
    // ) {
    //   return {
    //     data: null,
    //     message: 'Unauthorized',
    //     status: 401,
    //   };
    // }

    // Hash the password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Remove confirmPassword from data
    const {
      confirmPassword,
      password,
      phone,
      notes,
      dateOfBirth,
      address,
      ...employeeData
    } = data;

    console.log('first log', employeeData);

    const finalData = {
      ...employeeData,
      employeeId: `EMP${String(Math.floor(Math.random() * 100000)).padStart(6, '0')}`,
      // hireDate: new Date(data.hireDate),
      // phone: phone || null,
      passwordHash: hashedPassword,
    };

    console.log('second log', finalData);

    const employee = await db.user.create({
      data: {
        ...finalData,
        // dateOfBirth: new Date(data.dateOfBirth),
        // bankAccountDetails: {
        //   bankName: data.bankName,
        //   accountNumber: data.accountNumber,
        //   routingNumber: data.routingNumber,
        // },
      },
    });

    console.log('Employee', employee);

    return {
      data: employee,
      message: 'Employee created successfully',
      status: 201,
    };
  } catch (error: any) {
    console.error('Error creating employee:', error);
    return {
      data: null,
      message: 'Internal Server Error',
      status: 500,
    };
  }
}

export async function getEmployeeById(id: string) {
  try {
    // check if user is authorized to view employee details
    // const session = await getServerSession(authOptions);
    // if (
    //   !session ||
    //   (session.user.role !== 'ADMIN' && session.user.role !== 'MANAGER')
    // ) {
    //   return {
    //     data: null,
    //     message: 'Unauthorized',
    //     status: 401,
    //   };
    // }

    // check of there is a provided ID
    if (!id) {
      return {
        data: null,
        status: 400,
        message: 'Bad Request: No ID provided',
      };
    }
    const employee = await db.user.findUnique({
      where: { id },
      include: {
        manager: {
          select: {
            id: true,
            name: true,
            email: true,
            position: true,
          },
        },
        managedEmployees: {
          select: {
            id: true,
            name: true,
            email: true,
            position: true,
          },
        },
        paymentRecords: {
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
        leaves: {
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
        attendanceRecords: {
          take: 5,
          orderBy: { date: 'desc' },
        },
        performanceReviews: {
          take: 5,
          orderBy: { reviewDate: 'desc' },
        },
      },
    });

    if (!employee) {
      return {
        data: null,
        status: 404,
        message: 'Employee not found',
      };
    }

    return {
      data: employee,
      status: 200,
      message: 'Employee fetched successfully',
    };
  } catch (error) {
    console.log('Error:', error);
    return {
      data: null,
      status: 500,
      message: 'Server Error: Unable to fetch employee',
    };
  }
}
