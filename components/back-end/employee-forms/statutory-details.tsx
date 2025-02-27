'use client';

import type { User } from '@prisma/client';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import CustomText from '@/components/back-end/re-usable-inputs/text-reusable';
import { Button } from '@/components/ui/button';

type FormValues = z.infer<any>;

interface StatutoryDetailsProps {
  isEditing: boolean;
  data: User;
}

export function StatutoryDetails({ isEditing, data }: StatutoryDetailsProps) {
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
        body: JSON.stringify({ statutoryDetails: data }),
      });
      if (!response.ok) throw new Error('Failed to update');
    } catch (error) {
      console.error('Error updating statutory details:', error);
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
            type="number"
            placeholder="Eg; 3074948611"
            disabled={!isEditing}
            className="w-full"
          />

          <CustomText
            label="Aadhaar Number"
            register={register}
            name="aadhaarNumber"
            errors={errors}
            type="number"
            placeholder="Eg; 30371648611"
            disabled={!isEditing}
            className="w-full"
          />

          <CustomText
            label="UAN Number"
            register={register}
            name="uanNumber"
            errors={errors}
            type="number"
            placeholder="Eg; 84102947"
            disabled={!isEditing}
            className="w-full"
          />

          <CustomText
            label="PF Number"
            register={register}
            name="pfNumber"
            errors={errors}
            type="number"
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
