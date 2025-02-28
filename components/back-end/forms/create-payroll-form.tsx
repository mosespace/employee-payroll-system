'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { CalendarIcon, Calculator, DollarSign } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Separator } from '@/components/ui/separator';
import { toast } from '@mosespace/toast';

// Define the form schema
const payrollFormSchema = z.object({
  employeeId: z.string({
    required_error: 'Please select an employee.',
  }),
  paymentMethod: z.enum(['BANK_TRANSFER', 'STRIPE', 'MOBILE_MONEY', 'CHECK'], {
    required_error: 'Please select a payment method.',
  }),
  paymentDate: z.date({
    required_error: 'Payment date is required.',
  }),
  payPeriodStart: z.date({
    required_error: 'Pay period start date is required.',
  }),
  payPeriodEnd: z.date({
    required_error: 'Pay period end date is required.',
  }),
  baseSalary: z.coerce.number().min(0, 'Base salary must be a positive number'),
  housingAllowance: z.coerce.number().min(0).optional(),
  transportAllowance: z.coerce.number().min(0).optional(),
  mealAllowance: z.coerce.number().min(0).optional(),
  otherAllowances: z.coerce.number().min(0).optional(),
  taxDeductions: z.coerce.number().min(0).optional(),
  insuranceDeduction: z.coerce.number().min(0).optional(),
  pensionDeduction: z.coerce.number().min(0).optional(),
  otherDeductions: z.coerce.number().min(0).optional(),
  description: z.string().optional(),
  status: z
    .enum(['PENDING', 'COMPLETED', 'FAILED'], {
      required_error: 'Please select a status.',
    })
    .default('PENDING'),
  transactionId: z.string().optional(),
});

type PayrollFormValues = z.infer<typeof payrollFormSchema>;

// Mock data for employees
const employees = [
  {
    id: '1',
    name: 'Pristia Candra',
    position: 'UI UX Designer',
    baseSalary: 5000,
  },
  {
    id: '2',
    name: 'John Doe',
    position: 'Frontend Developer',
    baseSalary: 6000,
  },
  {
    id: '3',
    name: 'Jane Smith',
    position: 'Product Manager',
    baseSalary: 7500,
  },
  {
    id: '4',
    name: 'Alex Johnson',
    position: 'Backend Developer',
    baseSalary: 6500,
  },
  { id: '5', name: 'Sarah Williams', position: 'HR Manager', baseSalary: 5500 },
];

// Mock function to get employee compensation details
const getEmployeeCompensation = (employeeId: string) => {
  const employee = employees.find((emp) => emp.id === employeeId);

  return {
    baseSalary: employee?.baseSalary || 0,
    housingAllowance: 500,
    transportAllowance: 300,
    mealAllowance: 200,
    otherAllowances: 100,
    taxDeduction: 800,
    insuranceDeduction: 200,
    pensionDeduction: 400,
    otherDeduction: 0,
  };
};

export default function CreatePayrollForm() {
  const [netAmount, setNetAmount] = useState<number>(0);

  // Initialize the form
  const form = useForm<PayrollFormValues>({
    resolver: zodResolver(payrollFormSchema),
    defaultValues: {
      paymentDate: new Date(),
      payPeriodStart: new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        1,
      ),
      payPeriodEnd: new Date(
        new Date().getFullYear(),
        new Date().getMonth() + 1,
        0,
      ),
      baseSalary: 0,
      housingAllowance: 0,
      transportAllowance: 0,
      mealAllowance: 0,
      otherAllowances: 0,
      taxDeductions: 0,
      insuranceDeduction: 0,
      pensionDeduction: 0,
      otherDeductions: 0,
      status: 'PENDING',
    },
  });

  // Watch form values to calculate net amount
  const watchedValues = form.watch();

  // Calculate net amount whenever relevant fields change
  useEffect(() => {
    const {
      baseSalary = 0,
      housingAllowance = 0,
      transportAllowance = 0,
      mealAllowance = 0,
      otherAllowances = 0,
      taxDeductions = 0,
      insuranceDeduction = 0,
      pensionDeduction = 0,
      otherDeductions = 0,
    } = watchedValues;

    const totalAllowances =
      (housingAllowance || 0) +
      (transportAllowance || 0) +
      (mealAllowance || 0) +
      (otherAllowances || 0);

    const totalDeductions =
      (taxDeductions || 0) +
      (insuranceDeduction || 0) +
      (pensionDeduction || 0) +
      (otherDeductions || 0);

    const calculatedNetAmount =
      (baseSalary || 0) + totalAllowances - totalDeductions;
    setNetAmount(calculatedNetAmount);
  }, [watchedValues]);

  // Handle employee selection and auto-fill compensation details
  const handleEmployeeChange = (employeeId: string) => {
    const compensation = getEmployeeCompensation(employeeId);

    form.setValue('employeeId', employeeId);
    form.setValue('baseSalary', compensation.baseSalary);
    form.setValue('housingAllowance', compensation.housingAllowance);
    form.setValue('transportAllowance', compensation.transportAllowance);
    form.setValue('mealAllowance', compensation.mealAllowance);
    form.setValue('otherAllowances', compensation.otherAllowances);
    form.setValue('taxDeductions', compensation.taxDeduction);
    form.setValue('insuranceDeduction', compensation.insuranceDeduction);
    form.setValue('pensionDeduction', compensation.pensionDeduction);
    form.setValue('otherDeductions', compensation.otherDeduction);
  };

  // Form submission handler
  const onSubmit = async (data: PayrollFormValues) => {
    // In a real application, you would send this data to your API
    console.log({
      ...data,
      netAmount,
      createdById: 'current-user-id', // This would come from your auth context
    });

    toast.success(
      'Payroll created successfully',
      `Payment of $${netAmount.toFixed(2)} for ${employees.find((e) => e.id === data.employeeId)?.name}`,
    );

    // Reset form after submission
    form.reset();
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Create Payroll</CardTitle>
          <CardDescription>
            Create a new payment record for an employee
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Employee Selection */}
                <FormField
                  control={form.control}
                  name="employeeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employee</FormLabel>
                      <Select
                        onValueChange={handleEmployeeChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an employee" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {employees.map((employee) => (
                            <SelectItem key={employee.id} value={employee.id}>
                              {employee.name} - {employee.position}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Payment Method */}
                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Method</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select payment method" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="BANK_TRANSFER">
                            Bank Transfer
                          </SelectItem>
                          <SelectItem value="STRIPE">Stripe</SelectItem>
                          <SelectItem value="MOBILE_MONEY">
                            Mobile Money
                          </SelectItem>
                          <SelectItem value="CHECK">Check</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Payment Date */}
                <FormField
                  control={form.control}
                  name="paymentDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Payment Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={'outline'}
                              className={`w-full pl-3 text-left font-normal ${!field.value ? 'text-muted-foreground' : ''}`}
                            >
                              {field.value ? (
                                format(field.value, 'PPP')
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Payment Status */}
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="PENDING">Pending</SelectItem>
                          <SelectItem value="COMPLETED">Completed</SelectItem>
                          <SelectItem value="FAILED">Failed</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Pay Period Start */}
                <FormField
                  control={form.control}
                  name="payPeriodStart"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Pay Period Start</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={'outline'}
                              className={`w-full pl-3 text-left font-normal ${!field.value ? 'text-muted-foreground' : ''}`}
                            >
                              {field.value ? (
                                format(field.value, 'PPP')
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Pay Period End */}
                <FormField
                  control={form.control}
                  name="payPeriodEnd"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Pay Period End</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={'outline'}
                              className={`w-full pl-3 text-left font-normal ${!field.value ? 'text-muted-foreground' : ''}`}
                            >
                              {field.value ? (
                                format(field.value, 'PPP')
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Transaction ID */}
                <FormField
                  control={form.control}
                  name="transactionId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Transaction ID (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Transaction ID" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-medium mb-4">Salary Calculation</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Base Salary */}
                  <FormField
                    control={form.control}
                    name="baseSalary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Base Salary</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                            <Input type="number" className="pl-10" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Housing Allowance */}
                  <FormField
                    control={form.control}
                    name="housingAllowance"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Housing Allowance</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                            <Input type="number" className="pl-10" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Transport Allowance */}
                  <FormField
                    control={form.control}
                    name="transportAllowance"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Transport Allowance</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                            <Input type="number" className="pl-10" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Meal Allowance */}
                  <FormField
                    control={form.control}
                    name="mealAllowance"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Meal Allowance</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                            <Input type="number" className="pl-10" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Other Allowances */}
                  <FormField
                    control={form.control}
                    name="otherAllowances"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Other Allowances</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                            <Input type="number" className="pl-10" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Tax Deductions */}
                  <FormField
                    control={form.control}
                    name="taxDeductions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tax Deductions</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                            <Input type="number" className="pl-10" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Insurance Deduction */}
                  <FormField
                    control={form.control}
                    name="insuranceDeduction"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Insurance Deduction</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                            <Input type="number" className="pl-10" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Pension Deduction */}
                  <FormField
                    control={form.control}
                    name="pensionDeduction"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pension Deduction</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                            <Input type="number" className="pl-10" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Other Deductions */}
                  <FormField
                    control={form.control}
                    name="otherDeductions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Other Deductions</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                            <Input type="number" className="pl-10" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Net Amount Display */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Calculator className="h-5 w-5 mr-2 text-gray-500" />
                      <span className="font-medium">Net Amount:</span>
                    </div>
                    <div className="text-xl font-bold">
                      ${netAmount.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Add any additional notes or description for this payment"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Create Payroll
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
