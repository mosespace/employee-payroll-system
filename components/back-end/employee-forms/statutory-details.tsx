'use client';

import type { StatutoryDetails, User } from '@prisma/client';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import CustomText from '@/components/back-end/re-usable-inputs/text-reusable';
import { Button } from '@/components/ui/button';
import { toast } from '@mosespace/toast';
import { useState } from 'react';
import { updateEmployee } from '@/actions/employees';
import Submit from './submit';

type FormValues = z.infer<any>;

interface StatutoryDetailsProps {
  isEditing: boolean;
  data?: (User & { statutory: StatutoryDetails }) | null | undefined;
}

export function StatutoryDetails({ isEditing, data }: StatutoryDetailsProps) {
  const [loading, setLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<any>({
    // resolver: zodResolver(formSchema),
    defaultValues: {
      panNumber: data?.statutory?.panNumber,
      uan: data?.statutory?.uanNumber,
      aadhaarNumber: data?.statutory?.aadhaarNumber,
      pfNumber: data?.statutory?.pfNumber,
      esiNumber: data?.statutory?.esiNumber,
      taxId: data?.statutory?.taxId,
    },
  });

  const employeeId = data?.id;
  async function onSubmit(formData: FormValues) {
    // console.log('FormData ✅:', formData);

    try {
      setLoading(true);
      const dataToSubmit = {
        statutory: {
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
            label="PAN Number"
            register={register}
            name="panNumber"
            errors={errors}
            type="text"
            placeholder="Eg; 3074948611"
            disabled={!isEditing}
            className="w-full"
          />

          <CustomText
            label="Aadhaar Number"
            register={register}
            name="aadhaarNumber"
            errors={errors}
            type="text"
            placeholder="Eg; 30371648611"
            disabled={!isEditing}
            className="w-full"
          />

          <CustomText
            label="UAN Number"
            register={register}
            name="uanNumber"
            errors={errors}
            type="text"
            placeholder="Eg; 84102947"
            disabled={!isEditing}
            className="w-full"
          />

          <CustomText
            label="PF Number"
            register={register}
            name="pfNumber"
            errors={errors}
            type="text"
            placeholder="Eg; 63736372"
            disabled={!isEditing}
            className="w-full"
          />

          <CustomText
            label="ESI Number"
            register={register}
            name="esiNumber"
            errors={errors}
            placeholder="Eg; 8131661-3i1ga31"
            disabled={!isEditing}
            className="w-full"
          />

          <CustomText
            label="Tax ID"
            register={register}
            name="taxId"
            errors={errors}
            placeholder="Eg; tax-31939"
            disabled={!isEditing}
            className="w-full"
          />
        </div>
        {isEditing && <Submit loading={loading} />}
      </form>
    </div>
  );
}
