'use server';

import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import bcrypt from 'bcrypt';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

export type EmployeeBasic = {
  value: string;
  label: string;
};

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

        attendanceRecords: {
          take: 5,
          orderBy: { date: 'desc' },
        },
        performanceReviews: {
          take: 5,
          orderBy: { reviewDate: 'desc' },
        },
        bankDetails: {
          select: {
            id: true,
            accountNumber: true,
            swiftCode: true,
            ibanNumber: true,
            accountType: true,
            branchName: true,
            accountName: true,
            bankName: true,
            employeeId: true,
            routingNumber: true,
          },
        },
        statutory: true,
        compensation: true,
        leaves: true,
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

export async function updateEmployee(data: any, employeeId: string) {
  try {
    // Authorization check commented out but can be uncommented when needed
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
    console.log('Log DATA 👨‍💻:', data);

    // Check if data is provided
    if (!data) {
      return {
        data: null,
        status: 400,
        message: 'Bad Request: No Data provided',
      };
    }

    // Find if employee exists in the database
    const employee = await getEmployeeById(employeeId);

    if (!employee) {
      return {
        data: null,
        status: 404,
        message: 'Employee not found',
      };
    }

    // Extract related entities data from the input
    const { bankDetails, statutory, compensation, leaves, ...userData } = data;

    // Update the user data
    // Update the user data
    const updated_employee = await db.user.update({
      where: {
        id: employeeId,
      },
      data: {
        ...userData,
        // Handle nested bank details update if provided
        ...(bankDetails && {
          bankDetails: {
            upsert: {
              create: {
                ...bankDetails,
              },
              update: {
                ...bankDetails,
              },
            },
          },
        }),
        // Handle nested statutory details update if provided
        ...(statutory && {
          statutory: {
            upsert: {
              create: {
                ...statutory,
              },
              update: {
                ...statutory,
              },
            },
          },
        }),
        // Handle nested compensation details update if provided
        ...(compensation && {
          compensation: {
            upsert: {
              create: {
                ...compensation,
              },
              update: {
                ...compensation,
              },
            },
          },
        }),
        // Handle leaves update if provided (moved outside of compensation)
        ...(leaves && {
          leaves: {
            create: Array.isArray(leaves)
              ? leaves.map((leave) => ({
                  leaveType: leave.leaveType,
                  startDate: new Date(leave.startDate),
                  endDate: new Date(leave.endDate),
                  reason: leave.reason,
                  noticePeriod: leave.noticePeriod
                    ? parseInt(leave.noticePeriod)
                    : null,
                  status: leave.status || 'PENDING',
                  remarks: leave.remarks,
                }))
              : {
                  leaveType: leaves.leaveType,
                  startDate: new Date(leaves.startDate),
                  endDate: new Date(leaves.endDate),
                  reason: leaves.reason,
                  noticePeriod: leaves.noticePeriod
                    ? parseInt(leaves.noticePeriod)
                    : null,
                  status: leaves.status || 'PENDING',
                  remarks: leaves.remarks,
                },
          },
        }),
      },
      include: {
        bankDetails: true,
        statutory: true,
        compensation: true,
        leaves: true,
      },
    });

    revalidatePath(`/dashboard/employees/${updated_employee.id}`);

    return {
      data: updated_employee,
      status: 200,
      message: 'Employee updated successfully',
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      data: null,
      status: 500,
      message: 'Server Error: Unable to update employee',
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function getManagersAndAdmins() {
  try {
    const users = await db.user.findMany({
      where: {
        role: {
          in: ['ADMIN', 'MANAGER'],
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        position: true,
      },
    });

    return {
      data: users,
      status: 200,
      message: 'Managers and admins fetched successfully',
    };
  } catch (error) {
    console.error('Error fetching managers and admins:', error);
    return {
      data: null,
      status: 500,
      message: 'Failed to fetch managers and admins',
    };
  }
}

export async function getEmployees() {
  try {
    const employees = await db.user.findMany({
      include: {
        manager: true,
        bankDetails: true,
        paymentRecords: true,
        statutory: true,
        bonuses: true,
      },
      where: {
        role: 'EMPLOYEE',
      },
    });

    return {
      status: 200,
      data: employees,
      message: 'Employees fetched back successfully',
    };
  } catch (error) {
    console.log('Failed to fetch Employees', error);
    return {
      message: 'Hello world',
      data: null,
      status: 500,
    };
  }
}

export async function getEmployeeProjects(employeeId: string) {
  try {
    // check if user is authorized to view employee details
    const session = await getServerSession(authOptions);
    if (!session) {
      return {
        data: null,
        message: 'Unauthorized',
        status: 401,
      };
    }

    // check of there is a provided ID
    if (!employeeId) {
      return {
        data: null,
        status: 400,
        message: 'Bad Request: No ID provided',
      };
    }
    const employee = await db.user.findUnique({
      where: { id: employeeId },
      include: {
        projects: true,
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

export async function logProjectHours(formData: FormData) {
  // In a real app, you would create a record in a project_hours table
  // For now, we'll just return success

  return { success: true };
}

export async function getOnlyEmployees() {
  try {
    const employees = await db.user.findMany({
      select: {
        id: true,
        name: true,
      },
      where: {
        role: 'EMPLOYEE',
      },
    });

    return {
      status: 200,
      data: employees?.map((e) => {
        return {
          value: e.id,
          label: e.name,
        };
      }),
      message: 'Employees fetched back successfully',
    };
  } catch (error) {
    console.log('Failed to fetch Employees', error);
    return {
      message: 'Hello world',
      data: null,
      status: 500,
    };
  }
}
