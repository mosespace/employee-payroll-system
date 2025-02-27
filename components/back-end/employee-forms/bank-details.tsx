'use client';

import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { updateEmployee } from '@/actions/employees';
import CustomText from '@/components/back-end/re-usable-inputs/text-reusable';
import { toast } from '@mosespace/toast';
import type { BankDetails, User } from '@prisma/client';
import { useState } from 'react';
import Submit from './submit';

type FormValues = z.infer<any>;

interface BankDetailsProps {
  isEditing: boolean;
  data?: (User & { bankDetails: BankDetails }) | null | undefined;
}

export function BankDetails({ isEditing, data }: BankDetailsProps) {
  const [loading, setLoading] = useState<boolean>(false);

  // console.log('Bank Details:', data);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<any>({
    defaultValues: {
      bankName: data?.bankDetails?.bankName,
      accountNumber: data?.bankDetails?.accountNumber,
      branchName: data?.bankDetails?.branchName,
      routingNumber: data?.bankDetails?.routingNumber,
      swiftCode: data?.bankDetails?.swiftCode,
      ibanNumber: data?.bankDetails?.ibanNumber,
      accountName: data?.bankDetails?.accountName,
    },
  });

  const employeeId = data?.id;

  async function onSubmit(formData: FormValues) {
    // console.log('FormData ✅:', formData);

    try {
      setLoading(true);
      const dataToSubmit = {
        bankDetails: {
          ...formData,
          // employeeId,
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
        <div className="grid grid-cols-2 gap-6">
          <CustomText
            label="Bank Name"
            register={register}
            name="bankName"
            errors={errors}
            placeholder="Eg; Stanbic Bank"
            disabled={!isEditing}
            className="w-full"
          />
          <CustomText
            label="Account Number"
            register={register}
            name="accountNumber"
            errors={errors}
            placeholder="Eg; CM93731031-83019731389"
            disabled={!isEditing}
            className="w-full"
          />
          <CustomText
            label="Branch Name"
            register={register}
            name="branchName"
            errors={errors}
            placeholder="Eg; Stanbic Lugogo"
            disabled={!isEditing}
            className="w-full"
          />
          <CustomText
            label="Routing Number"
            register={register}
            name="routingNumber"
            errors={errors}
            type="text"
            placeholder="Eg; 391731-CN-031"
            disabled={!isEditing}
            className="w-full"
          />
          <CustomText
            label="SWIFT Code"
            register={register}
            name="swiftCode"
            errors={errors}
            placeholder="Eg; SWIFT-391731-CN-031-"
            disabled={!isEditing}
            className="w-full"
          />
          <CustomText
            label="IBAN Number"
            register={register}
            name="ibanNumber"
            type="text"
            errors={errors}
            placeholder="Eg; 91731031"
            disabled={!isEditing}
            className="w-full"
          />{' '}
        </div>
        <CustomText
          label="Account Names"
          register={register}
          name="accountName"
          errors={errors}
          placeholder="Eg; Kisakye Moses"
          disabled={!isEditing}
          // className="w-full"
        />

        {isEditing && <Submit loading={loading} />}
      </form>
    </div>
  );
}
