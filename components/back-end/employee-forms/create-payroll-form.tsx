'use client';

import { format } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Calculator,
  Clock,
  Loader,
  PersonStanding,
  Receipt,
  Wallet,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { createPayroll } from '@/actions/payroll';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { toast } from '@mosespace/toast';
import { User } from '@prisma/client';
import { useRouter } from 'next/navigation';
import Select from 'react-tailwindcss-select';
import { Option } from 'react-tailwindcss-select/dist/components/type';
import CustomDatePicker from '../re-usable-inputs/custom-date-picker';
import CustomTextArea from '../re-usable-inputs/custom-text-area';
import CustomText from '../re-usable-inputs/text-reusable';

// Define the type for the form values based on the schema
type PayrollFormValues = z.infer<any>;

const paymentMethods = [
  {
    value: 'BANK_TRANSFER',
    label: 'Bank Transfer',
  },
  {
    value: 'STRIPE',
    label: 'Stripe',
  },
  {
    value: 'MOBILE MONEY',
    label: 'Mobile Money',
  },
  {
    value: 'CHECK',
    label: 'Check',
  },
];

const paymentStatuses = [
  {
    value: 'FAILED',
    label: 'Failed',
  },
  {
    value: 'COMPLETED',
    label: 'Completed',
  },
  {
    value: 'PENDING',
    label: 'Pending',
  },
  {
    value: 'CHECK',
    label: 'Check',
  },
];

const sections = [
  { id: 'employee', title: 'Employee Details', icon: PersonStanding },
  { id: 'payment', title: 'Payment Details', icon: Wallet },
  { id: 'period', title: 'Pay Period', icon: Clock },
  { id: 'calculation', title: 'Salary Calculation', icon: Calculator },
  { id: 'summary', title: 'Summary', icon: Receipt },
];

export default function CreatePayrollForm({
  employees,
  payroll,
}: {
  employees: User[];
  payroll?: any;
}) {
  const [netAmount, setNetAmount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [employee, setEmployee] = useState<Option | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [activeSection, setActiveSection] = useState<string>('employee');
  const [paymentMethod, setPaymentMethod] = useState<Option | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<Option | null>(null);

  const router = useRouter();
  const options = employees?.map((employee) => {
    return {
      value: employee.id,
      label: employee.name,
    };
  });

  // console.log('Payroll ✅:', payroll);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    getValues,
    control,
    formState: { errors },
  } = useForm<any>({
    defaultValues: {
      ...payroll,
      // employeeId: '',
      // paymentMethod: 'BANK_TRANSFER',
      // status: 'PENDING',
      // paymentDate: new Date(),
      // payPeriodStart: new Date(),
      // payPeriodEnd: new Date(),
      // baseSalary: 0,
      // housingAllowance: 0,
      // transportAllowance: 0,
      // mealAllowance: 0,
      // otherAllowances: 0,
      // taxDeductions: 0,
      // insuranceDeduction: 0,
      // pensionDeduction: 0,
      // otherDeductions: 0,
      // description: '',
    },
  });

  useEffect(() => {
    const subscription = watch((value) => {
      const totalEarnings =
        (value.baseSalary || 0) +
        (value.housingAllowance || 0) +
        (value.transportAllowance || 0) +
        (value.mealAllowance || 0) +
        (value.otherAllowances || 0);

      const totalDeductions =
        (value.taxDeductions || 0) +
        (value.insuranceDeduction || 0) +
        (value.pensionDeduction || 0) +
        (value.otherDeductions || 0);

      setNetAmount(totalEarnings - totalDeductions);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const handleEmployeeChange = (option: Option | Option[] | null) => {
    if (!option || Array.isArray(option)) return;
    const employee = employees.find((emp) => emp.id === option.value);
    if (!employee) return;
    setSelectedEmployee(employee);
    setValue('baseSalary', employee.baseSalary || 0);
  };

  const calculateProgress = () => {
    const fields = getValues();
    const requiredFields = [
      'employeeId',
      'paymentMethod',
      'paymentDate',
      'payPeriodStart',
      'payPeriodEnd',
      'baseSalary',
    ];
    const filledFields = requiredFields.filter(
      (field) => fields[field as keyof PayrollFormValues],
    );
    return (filledFields.length / requiredFields.length) * 100;
  };

  async function onSubmit(formData: any) {
    try {
      setLoading(true);
      const dataToSubmit = {
        ...formData,
        employeeId: employee?.value,
        paymentMethod: paymentMethod?.value,
        paymentStatus: paymentStatus?.value,
        otherAllowance: parseFloat(formData.otherAllowance),
      };

      const result = await createPayroll(dataToSubmit as any);

      if (result.status === 200) {
        toast.success('Payroll Created', `${result.message}`);
        router.push(`/dashboard/payroll/${result?.data?.id}`);
      } else {
        toast.error('Payroll Creation Error', `${result.message}`);
      }
    } catch (error) {
      toast.error(
        'Error',
        'An unexpected error occurred, Make sure all required fields are fields',
      );
    } finally {
      setLoading(false);
    }
  }

  // Initialize selections based on project when component mounts
  useEffect(() => {
    if (payroll) {
      if (payroll.status) {
        const matchedType = paymentStatuses.find(
          (opt) => opt.value === payroll.status,
        );
        if (matchedType) {
          setPaymentStatus(matchedType);
        }
      }

      if (payroll.employeeId) {
        const matchedType = options.find(
          (opt) => opt.value === payroll.employeeId,
        );
        if (matchedType) {
          setEmployee(matchedType);
        }
      }
      if (payroll.paymentMethod) {
        const matchedType = paymentMethods.find(
          (opt) => opt.value === payroll.paymentMethod,
        );
        if (matchedType) {
          setPaymentMethod(matchedType);
        }
      }
    }
  }, [payroll]);

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-5xl mx-auto">
        <CardHeader className="space-y-1 bg-primary/5 border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">
                {payroll ? 'Update' : 'Create'} Payroll
              </CardTitle>
              <CardDescription>
                {payroll ? 'Update' : 'Create a new'} payment record for an
                employee
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Completion</div>
              <Progress value={calculateProgress()} className="w-[200px] h-2" />
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex gap-6 mb-4 overflow-x-auto pb-4 scrollbar-hide">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                    activeSection === section.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  <section.icon className="h-4 w-4" />
                  <span>{section.title}</span>
                </button>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>

          <div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 mt-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSection}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {activeSection === 'employee' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 gap-6 w-full">
                        <div className="">
                          <h2 className="pb-2 block text-sm font-medium leading-6">
                            Select Employee
                          </h2>
                          <Select
                            value={employee}
                            onChange={(option) => {
                              setEmployee(option as Option);
                              handleEmployeeChange(option);
                            }}
                            options={options}
                            isClearable={true}
                            primaryColor="emerald"
                            isSearchable={false}
                            placeholder="Select Employee"
                          />
                        </div>
                      </div>

                      {selectedEmployee && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="grid grid-cols-1 md:grid-cols-3 gap-4"
                        >
                          <Card>
                            <CardHeader className="pb-3">
                              <CardTitle className="text-sm font-medium text-muted-foreground">
                                Base Salary
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="text-2xl font-bold">
                                $
                                {(
                                  selectedEmployee.baseSalary || 0
                                ).toLocaleString()}
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                Monthly compensation
                              </p>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardHeader className="pb-3">
                              <CardTitle className="text-sm font-medium text-muted-foreground">
                                Position
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="text-2xl font-bold">
                                {selectedEmployee.position}
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                Current role
                              </p>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardHeader className="pb-3">
                              <CardTitle className="text-sm font-medium text-muted-foreground">
                                Employee ID
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="text-2xl font-bold">
                                #{selectedEmployee.employeeId}
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                Unique identifier
                              </p>
                            </CardContent>
                          </Card>
                        </motion.div>
                      )}
                    </div>
                  )}

                  {activeSection === 'payment' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h2 className="pb-2 block text-sm font-medium leading-6">
                          Select Payment Method
                        </h2>
                        <Select
                          value={paymentMethod}
                          onChange={(option) =>
                            setPaymentMethod(option as Option)
                          }
                          options={paymentMethods}
                          isClearable={true}
                          primaryColor="emerald"
                          isSearchable={false}
                          placeholder="Select Payment Method"
                        />
                      </div>

                      <div>
                        <h2 className="pb-2 block text-sm font-medium leading-6">
                          Select Payment Status
                        </h2>
                        <Select
                          value={paymentStatus}
                          onChange={(option) =>
                            setPaymentStatus(option as Option)
                          }
                          options={paymentStatuses}
                          isClearable={true}
                          primaryColor="emerald"
                          isSearchable={false}
                          placeholder="Select Payment Status"
                        />
                      </div>

                      <CustomDatePicker
                        label="Payment Date"
                        name="paymentDate"
                        control={control}
                        errors={errors}
                        className=""
                      />

                      <CustomText
                        label="Transaction ID (Optional)"
                        register={register}
                        name="transactionId"
                        type="number"
                        errors={errors}
                        placeholder="Eg; adad-425364-gsg"
                        className="w-full"
                      />
                    </div>
                  )}

                  {activeSection === 'period' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <CustomDatePicker
                          label="Pay Period Start"
                          name="payPeriod"
                          control={control}
                          errors={errors}
                          className=""
                        />
                        <CustomDatePicker
                          label="Pay Period End"
                          name="payPeriodEnd"
                          control={control}
                          errors={errors}
                          className=""
                        />
                      </div>

                      <Card className="bg-muted/30">
                        <CardContent className="pt-6">
                          <div className="flex items-center gap-4">
                            <Clock className="h-8 w-8 text-muted-foreground" />
                            <div>
                              <h4 className="font-medium">
                                Pay Period Duration
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                The selected pay period will determine the
                                calculation of salary and benefits
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {activeSection === 'calculation' && (
                    <div className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Earnings Section */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">Earnings</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <CustomText
                              label="Base Salary"
                              register={register}
                              name="baseSalary"
                              errors={errors}
                              type="number"
                              placeholder="Eg; 80000(UGX)"
                              className="w-full"
                            />
                            <CustomText
                              label="Housing Allowance (Optional)"
                              register={register}
                              name="housingAllowance"
                              errors={errors}
                              type="number"
                              isRequired={false}
                              placeholder="Eg; 1000(UGX)"
                              className="w-full"
                            />
                            <CustomText
                              label="Transport Allowance (Optional)"
                              register={register}
                              name="transportAllowance"
                              errors={errors}
                              type="number"
                              isRequired={false}
                              placeholder="Eg; 40000(UGX)"
                              className="w-full"
                            />

                            <CustomText
                              label="Meal Allowance (Optional)"
                              register={register}
                              name="mealAllowance"
                              errors={errors}
                              type="number"
                              isRequired={false}
                              placeholder="Eg; 2000(UGX)"
                              className="w-full"
                            />

                            <CustomText
                              label="Other Allowance (Optional)"
                              register={register}
                              name="otherAllowance"
                              errors={errors}
                              type="number"
                              isRequired={false}
                              placeholder="Eg; 5000(UGX)"
                              className="w-full"
                            />
                          </CardContent>
                        </Card>

                        {/* Deductions Section */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">
                              Deductions
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <CustomText
                              label="Tax Deductions (Optional)"
                              register={register}
                              name="taxDeductions"
                              errors={errors}
                              type="number"
                              isRequired={false}
                              placeholder="Eg; 70(%)"
                              className="w-full"
                            />
                            <CustomText
                              label="Insurance Deductions (Optional)"
                              register={register}
                              name="insuranceDeductions"
                              errors={errors}
                              type="number"
                              isRequired={false}
                              placeholder="Eg; 50(%)"
                              className="w-full"
                            />

                            <CustomText
                              label="Pension Deductions (Optional)"
                              register={register}
                              name="pensionDeductions"
                              errors={errors}
                              type="number"
                              isRequired={false}
                              placeholder="Eg; 40(%)"
                              className="w-full"
                            />

                            <CustomText
                              label="Other Deductions (Optional)"
                              register={register}
                              name="otherDeductions"
                              errors={errors}
                              type="number"
                              isRequired={false}
                              placeholder="Eg; 10(%)"
                              className="w-full"
                            />
                            <CustomText
                              label="Benefits (Optional)"
                              register={register}
                              name="benefits"
                              isRequired={false}
                              errors={errors}
                              type="number"
                              placeholder="Eg; 2 (People)"
                              className="w-full"
                            />
                          </CardContent>
                        </Card>
                      </div>

                      {/* Net Amount Display */}
                      <Card className="bg-primary text-primary-foreground">
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-4">
                              <Calculator className="h-8 w-8" />
                              <div>
                                <h4 className="text-lg font-medium">
                                  Net Amount
                                </h4>
                                <p className="text-primary-foreground/80">
                                  Total payment after all calculations
                                </p>
                              </div>
                            </div>
                            <div className="text-3xl font-bold">
                              ${netAmount.toFixed(2)}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {activeSection === 'summary' && (
                    <div className="space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>Payment Summary</CardTitle>
                          <CardDescription>
                            Review all details before submission
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-6">
                            {selectedEmployee && (
                              <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
                                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                                  <PersonStanding className="h-8 w-8 text-primary" />
                                </div>
                                <div>
                                  <h3 className="font-medium">
                                    {selectedEmployee.name}
                                  </h3>
                                  <p className="text-sm text-muted-foreground">
                                    {selectedEmployee.position}
                                  </p>
                                </div>
                              </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-2">
                                <h4 className="font-medium text-sm">
                                  Payment Details
                                </h4>
                                <div className="space-y-1">
                                  <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">
                                      Method:
                                    </span>
                                    <span className="font-medium">
                                      {getValues('paymentMethod')?.replace(
                                        '_',
                                        ' ',
                                      )}
                                    </span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">
                                      Status:
                                    </span>
                                    <span className="font-medium">
                                      {getValues('status')}
                                    </span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">
                                      Payment Date:
                                    </span>
                                    <span className="font-medium">
                                      {getValues('paymentDate')
                                        ? format(
                                            getValues('paymentDate'),
                                            'PPP',
                                          )
                                        : '--'}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <h4 className="font-medium text-sm">
                                  Pay Period
                                </h4>
                                <div className="space-y-1">
                                  <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">
                                      Start Date:
                                    </span>
                                    <span className="font-medium">
                                      {getValues('payPeriodStart')
                                        ? format(
                                            getValues('payPeriodStart'),
                                            'PPP',
                                          )
                                        : '--'}
                                    </span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">
                                      End Date:
                                    </span>
                                    <span className="font-medium">
                                      {getValues('payPeriodEnd')
                                        ? format(
                                            getValues('payPeriodEnd'),
                                            'PPP',
                                          )
                                        : '--'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <Separator />

                            <div className="space-y-4">
                              <h4 className="font-medium text-sm">
                                Salary Breakdown
                              </h4>
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">
                                    Base Salary
                                  </span>
                                  <span className="font-medium">
                                    ${getValues('baseSalary') || 0}
                                  </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">
                                    Total Allowances
                                  </span>
                                  <span className="font-medium text-green-600">
                                    +$
                                    {(
                                      (getValues('housingAllowance') || 0) +
                                      (getValues('transportAllowance') || 0) +
                                      (getValues('mealAllowance') || 0) +
                                      (getValues('otherAllowances') || 0)
                                    ).toFixed(2)}
                                  </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">
                                    Total Deductions
                                  </span>
                                  <span className="font-medium text-red-600">
                                    -$
                                    {(getValues('taxDeductions') || 0) +
                                      (getValues('insuranceDeduction') || 0) +
                                      (getValues('pensionDeduction') || 0) +
                                      (getValues('otherDeductions') || 0)}
                                  </span>
                                </div>
                                <Separator />
                                <div className="flex justify-between text-sm font-medium">
                                  <span>Net Amount</span>
                                  <span className="text-xl">
                                    ${netAmount.toFixed(2)}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <CustomTextArea
                              label="Description"
                              register={register}
                              name="description"
                              errors={errors}
                              height={8}
                              isRequired={false}
                            />
                          </div>
                        </CardContent>
                      </Card>

                      <Button
                        type="submit"
                        disabled={loading}
                        className="w-full h-12 text-lg"
                      >
                        {loading ? (
                          <span className="flex items-center gap-2">
                            <Loader className="animate-spin size-4" />
                            Creating...
                          </span>
                        ) : (
                          <span> Create Payroll</span>
                        )}
                      </Button>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
