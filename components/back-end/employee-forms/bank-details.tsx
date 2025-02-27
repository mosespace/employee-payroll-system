'use client';

import type { User } from '@prisma/client';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import CustomText from '@/components/back-end/re-usable-inputs/text-reusable';
import { Button } from '@/components/ui/button';

const formSchema = z.object({
  bankName: z.string().min(1, 'Bank name is required'),
  accountNumber: z.string().min(1, 'Account number is required'),
  accountType: z.enum(['SAVINGS', 'CHECKING', 'CURRENT']),
  branchName: z.string().min(1, 'Branch name is required'),
  routingNumber: z.string().min(1, 'Routing number is required'),
  swiftCode: z.string().optional(),
  ibanNumber: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface BankDetailsProps {
  isEditing: boolean;
  data?: User;
}

export function BankDetails({ isEditing, data }: BankDetailsProps) {
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
        body: JSON.stringify({ bankAccountDetails: data }),
      });
      if (!response.ok) throw new Error('Failed to update');
    } catch (error) {
      console.error('Error updating bank details:', error);
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
            type="number"
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
            type="number"
            errors={errors}
            placeholder="Eg; 91731031"
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
