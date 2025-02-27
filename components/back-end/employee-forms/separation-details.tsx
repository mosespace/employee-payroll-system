'use client';

import type { User } from '@prisma/client';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import CustomDatePicker from '@/components/back-end/re-usable-inputs/custom-date-picker';
import CustomTextArea from '@/components/back-end/re-usable-inputs/custom-text-area';
import FormSelectInput from '@/components/back-end/re-usable-inputs/select-input';
import CustomText from '@/components/back-end/re-usable-inputs/text-reusable';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Option } from 'react-tailwindcss-select/dist/components/type';

const formSchema = z.object({
  leaveType: z.enum(['RESIGNATION', 'TERMINATION', 'RETIREMENT', 'LAYOFF']),
  effectiveDate: z.string().min(1, 'Effective date is required'),
  reason: z.string().min(1, 'Reason is required'),
  noticePeriod: z.number().min(0, 'Notice period must be a positive number'),
  exitInterviewDate: z.string().optional(),
  clearanceStatus: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED']),
  remarks: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface SeparationDetailsProps {
  isEditing: boolean;
  data: User;
}

export function SeparationDetails({ isEditing, data }: SeparationDetailsProps) {
  // const form = useForm<FormValues>({
  //   resolver: zodResolver(formSchema),
  //   defaultValues: {
  //     clearanceStatus: 'PENDING',
  //     remarks: '',
  //   },
  // });
  const [leaveType, setLeaveType] = useState<Option | Option[]>([]);
  const {
    register,
    handleSubmit,
    watch,
    control,
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
        body: JSON.stringify({ separation: data }),
      });
      if (!response.ok) throw new Error('Failed to update');
    } catch (error) {
      console.error('Error updating separation details:', error);
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-2 gap-6">
          <FormSelectInput
            options={[
              {
                value: 'ANNUAL',
                label: 'Annual',
              },
              {
                value: 'SICK',
                label: 'Sick',
              },
              { value: 'MATERNITY', label: 'Maternity' },
              { value: 'PATERNITY', label: 'Paternity' },
              { value: 'BEREAVEMENT', label: 'Bereavement' },
              { value: 'UNPAID', label: 'Unpaid' },
              { value: 'OTHER', label: 'Other' },
            ]}
            label="Leave Type"
            option={leaveType}
            setOption={setLeaveType}
            model="leaveType"
            isSearchable={false}
            disabled={!isEditing}
          />

          <CustomDatePicker
            label="Effective Date"
            name="startDate"
            control={control}
            errors={errors}
            className=""
          />
          <CustomDatePicker
            label="Effective End Date"
            name="endDate"
            control={control}
            errors={errors}
            className=""
          />
          <CustomText
            label="Notice Period"
            register={register}
            name="noticePeriod"
            errors={errors}
            type="numbers"
            placeholder="Eg; 12(days)"
            disabled={!isEditing}
            className="w-full"
          />

          <CustomText
            label="Exit Interview Date"
            register={register}
            name="approvedBy"
            errors={errors}
            type="numbers"
            placeholder="Eg; Moses Kisakye"
            disabled={!isEditing}
            className="w-full"
          />

          <FormSelectInput
            options={[
              {
                value: 'PENDING',
                label: 'Pending',
              },
              {
                value: 'APPROVED',
                label: 'Approved',
              },
              { value: 'REJECTED', label: 'Rejected' },
            ]}
            label="Leave Status"
            option={leaveType}
            setOption={setLeaveType}
            model="status"
            isSearchable={false}
            disabled={!isEditing}
          />
          <CustomTextArea
            label="Reason"
            register={register}
            name="reason"
            errors={errors}
            disabled={!isEditing}
          />
          <CustomTextArea
            label="Remarks"
            register={register}
            name="remarks"
            errors={errors}
            disabled={!isEditing}
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
