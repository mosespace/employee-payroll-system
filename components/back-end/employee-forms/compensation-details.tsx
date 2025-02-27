'use client';

import { useForm } from 'react-hook-form';
import * as z from 'zod';

import FormSelectInput from '@/components/back-end/re-usable-inputs/select-input';
import CustomText from '@/components/back-end/re-usable-inputs/text-reusable';
import { Button } from '@/components/ui/button';
import { type User } from '@prisma/client';
import { useState } from 'react';
import { Option } from 'react-tailwindcss-select/dist/components/type';

const formSchema = z.object({
  baseSalary: z.number().min(0, 'Base salary must be a positive number'),
  paymentFrequency: z.enum(['WEEKLY', 'BIWEEKLY', 'MONTHLY', 'YEARLY']),
  overtimeRate: z.number().min(0, 'Overtime rate must be a positive number'),
  bonusEligibility: z.boolean(),
  allowances: z.object({
    housing: z.number().optional(),
    transport: z.number().optional(),
    meal: z.number().optional(),
    other: z.number().optional(),
  }),
  deductions: z.object({
    tax: z.number().optional(),
    insurance: z.number().optional(),
    pension: z.number().optional(),
    other: z.number().optional(),
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface CompensationDetailsProps {
  isEditing: boolean;
  data: User;
}

export function CompensationDetails({
  isEditing,
  data,
}: CompensationDetailsProps) {
  // const form = useForm<FormValues>({
  //   resolver: zodResolver(formSchema),
  //   defaultValues: {
  //     baseSalary: 0,
  //     overtimeRate: 0,
  //     bonusEligibility: false,
  //     allowances: {
  //       housing: 0,
  //       transport: 0,
  //       meal: 0,
  //       other: 0,
  //     },
  //     deductions: {
  //       tax: 0,
  //       insurance: 0,
  //       pension: 0,
  //       other: 0,
  //     },
  //   },
  // });

  const [paymentFrequency, setPaymentFrequency] = useState<Option | Option[]>(
    [],
  );

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<any>({
    // resolver: zodResolver(formSchema),
    defaultValues: {
      ...data,
    },
  });

  const employeeId = data?.id;

  async function onSubmit(data: FormValues) {
    try {
      const response = await fetch(`/api/employees/${employeeId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ compensation: data }),
      });
      if (!response.ok) throw new Error('Failed to update');
    } catch (error) {
      console.error('Error updating compensation details:', error);
    }
  }

  const frequency = [
    {
      value: 'WEEKLY',
      label: 'Weekly',
    },
    {
      value: 'BIWEEKLY',
      label: 'Bi-Weekly',
    },
    {
      value: 'MONTHLY',
      label: 'Monthly',
    },
    {
      value: 'YEARLY',
      label: 'Yearly',
    },
  ];

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-6">
          <div className="grid grid-cols-2 gap-4">
            <CustomText
              label="Base Salary"
              register={register}
              name="baseSalary"
              type="number"
              errors={errors}
              placeholder="Eg; 80000"
              disabled={!isEditing}
              className="w-full"
            />
            <FormSelectInput
              options={frequency}
              label="Employment Type"
              option={paymentFrequency}
              setOption={setPaymentFrequency}
              model="employee"
              isSearchable={false}
              disabled={!isEditing}
            />
          </div>

          <div className="grid gap-4">
            <h3 className="text-lg font-medium">Allowances</h3>
            <div className="grid grid-cols-2 gap-4">
              <CustomText
                label="Housing Allowance"
                register={register}
                name="housingAllowance"
                type="number"
                errors={errors}
                placeholder="Eg; 10000"
                disabled={!isEditing}
                className="w-full"
              />
              <CustomText
                label="Housing Allowance"
                register={register}
                name="transportAllowance"
                type="number"
                errors={errors}
                placeholder="Eg; 30000"
                disabled={!isEditing}
                className="w-full"
              />
              <CustomText
                label="Meal Allowance"
                register={register}
                name="mealAllowance"
                type="number"
                errors={errors}
                placeholder="Eg; 5000"
                disabled={!isEditing}
                className="w-full"
              />

              <CustomText
                label="Other Allowance"
                register={register}
                name="otherAllowance"
                type="number"
                errors={errors}
                placeholder="Eg; 9000"
                disabled={!isEditing}
                className="w-full"
              />
            </div>
          </div>

          <div className="grid gap-4">
            <h3 className="text-lg font-medium">Deductions</h3>
            <div className="grid grid-cols-2 gap-4">
              <CustomText
                label="Tax Deduction"
                register={register}
                name="taxDeduction"
                type="number"
                errors={errors}
                placeholder="Eg; 10%"
                disabled={!isEditing}
                className="w-full"
              />

              <CustomText
                label="Insurance Deductions"
                register={register}
                name="otherAllowance"
                type="number"
                errors={errors}
                placeholder="Eg; 20%"
                disabled={!isEditing}
                className="w-full"
              />

              <CustomText
                label="Pension Deduction"
                register={register}
                name="pensionDeduction"
                type="number"
                errors={errors}
                placeholder="Eg; 9%"
                disabled={!isEditing}
                className="w-full"
              />

              <CustomText
                label="Other Deductions"
                register={register}
                name="otherDeductions"
                type="number"
                errors={errors}
                placeholder="Eg; 5%"
                disabled={!isEditing}
                className="w-full"
              />
            </div>
          </div>
        </div>
        {isEditing && (
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => reset()}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        )}
      </form>
    </div>
  );
}
