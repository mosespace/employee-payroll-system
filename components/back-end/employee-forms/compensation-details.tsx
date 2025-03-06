'use client';

import { useForm } from 'react-hook-form';
import * as z from 'zod';

import FormSelectInput from '@/components/back-end/re-usable-inputs/select-input';
import CustomText from '@/components/back-end/re-usable-inputs/text-reusable';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { Option } from 'react-tailwindcss-select/dist/components/type';
import type { CompensationDetails, User } from '@prisma/client';
import { updateEmployee } from '@/actions/employees';
import { toast } from '@mosespace/toast';
import Submit from './submit';
import Select from 'react-tailwindcss-select';

type FormValues = z.infer<any>;

interface CompensationDetailsProps {
  isEditing: boolean;
  data?: (User & { compensation: CompensationDetails }) | null | undefined;
}

export function CompensationDetails({
  isEditing,
  data,
}: CompensationDetailsProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [frequency, setFrequency] = useState<Option | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<any>({
    defaultValues: {
      baseSalary: data?.compensation?.baseSalary,
      housingAllowance: data?.compensation?.housingAllowance,
      transportAllowance: data?.compensation?.transportAllowance,
      mealAllowance: data?.compensation?.mealAllowance,
      otherAllowances: data?.compensation?.otherAllowances,
      paymentFrequency: data?.compensation?.paymentFrequency,
      taxDeduction: data?.compensation?.taxDeduction,
      insuranceDeduction: data?.compensation?.insuranceDeduction,
      pensionDeduction: data?.compensation?.pensionDeduction,
      otherDeduction: data?.compensation?.otherDeduction,
    },
  });

  const employeeId = data?.id;

  const options = [
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

  // Initialize selections based on data when component mounts
  useEffect(() => {
    if (data) {
      // Set frequency status
      if (data.maritalStatus) {
        const matchedType = options.find(
          (opt) => opt.value === data?.compensation?.paymentFrequency,
        );
        if (matchedType) {
          setFrequency(matchedType);
        }
      }
    }
  }, [data]);

  async function onSubmit(formData: FormValues) {
    // console.log('FormData ✅:', formData);

    try {
      setLoading(true);

      const dataToSubmit = {
        compensation: {
          ...formData,
          housingAllowance: parseFloat(formData.housingAllowance),
          transportAllowance: parseFloat(formData.transportAllowance),
          mealAllowance: parseFloat(formData.mealAllowance),
          otherAllowances: parseFloat(formData.otherAllowances),
          taxDeduction: parseFloat(formData.taxDeduction),
          insuranceDeduction: parseFloat(formData.insuranceDeduction),
          pensionDeduction: parseFloat(formData.pensionDeduction),
          otherDeduction: parseFloat(formData.otherDeduction),
          paymentFrequency: frequency?.value,
        },
      };

      console.log('Data to be sent:', dataToSubmit);
      const result = await updateEmployee(dataToSubmit, employeeId as string);

      // Handle the response
      if (result.status === 200) {
        // Success handling
        toast.success('Success', 'Employee details updated successfully');
      } else {
        // Error handling
        toast.error('Error updating employee:', result.message);
      }
    } catch (error) {
      toast.error('Error', 'Failed to update employee details');
    } finally {
      setLoading(false);
    }
  }

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

            <div>
              <h2 className="pb-2 block text-sm font-medium leading-6">
                Payment Frequency
              </h2>
              <Select
                value={frequency}
                onChange={(option) => setFrequency(option as Option)}
                options={options}
                isClearable={true}
                isDisabled={!isEditing}
                primaryColor="emerald"
                isSearchable={false}
                placeholder="Select Payment Frequency"
              />
            </div>
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
                name="otherAllowances"
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
                name="insuranceDeduction"
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
                name="otherDeduction"
                type="number"
                errors={errors}
                placeholder="Eg; 5%"
                disabled={!isEditing}
                className="w-full"
              />
            </div>
          </div>
        </div>
        {isEditing && <Submit loading={loading} />}
      </form>
    </div>
  );
}
