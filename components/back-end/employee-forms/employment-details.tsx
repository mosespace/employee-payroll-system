'use client';

import { User } from '@prisma/client';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import CustomTextArea from '@/components/back-end/re-usable-inputs/custom-text-area';
import FormSelectInput from '@/components/back-end/re-usable-inputs/select-input';
import CustomText from '@/components/back-end/re-usable-inputs/text-reusable';
import { TimePicker12Demo } from '@/components/back-end/re-usable-inputs/time-picker/time-picker';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Option } from 'react-tailwindcss-select/dist/components/type';

const formSchema = z.object({
  employmentType: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERN']),
  department: z.string().min(1, 'Department is required'),
  position: z.string().min(1, 'Position is required'),
  reportingManager: z.string().min(1, 'Reporting manager is required'),
  workLocation: z.string().min(1, 'Work location is required'),
  workSchedule: z.object({
    startTime: z.string(),
    endTime: z.string(),
    daysPerWeek: z.number().min(1).max(7),
  }),
  probationPeriod: z.number().optional(),
  contractDuration: z.number().optional(),
  responsibilities: z.string().min(1, 'Responsibilities are required'),
});

type FormValues = z.infer<typeof formSchema>;

interface EmploymentDetailsProps {
  isEditing: boolean;
  data?: User | null | undefined;
}

export function EmploymentDetails({ isEditing, data }: EmploymentDetailsProps) {
  // Form setup
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<any>({
    // resolver: zodResolver(formSchema),
    defaultValues: {
      ...data,
    },
  });

  const employeeId = data?.id;

  // Time picker state management
  const [startDate, setStartDate] = useState<Date | undefined>(
    data?.checkInTime ? new Date(data.checkInTime) : new Date(),
  );

  const [endDate, setEndDate] = useState<Date | undefined>(
    data?.checkOutTime ? new Date(data.checkOutTime) : new Date(),
  );

  // Format and update times when they change
  React.useEffect(() => {
    if (startDate) {
      setValue('workSchedule.startTime', startDate.toISOString());
    }
  }, [startDate, setValue]);

  React.useEffect(() => {
    if (endDate) {
      setValue('workSchedule.endTime', endDate.toISOString());
    }
  }, [endDate, setValue]);

  async function onSubmit(formData: any) {
    try {
      // Ensure time values are correctly formatted in the submission
      const submissionData = {
        ...formData,
        workSchedule: {
          ...formData.workSchedule,
          // startTime: startDate?.toISOString(),
          // endTime: endDate?.toISOString(),
        },
      };

      const response = await fetch(`/api/employees/${employeeId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ employment: submissionData }),
      });
      if (!response.ok) throw new Error('Failed to update');
    } catch (error) {
      console.error('Error updating employment details:', error);
    }
  }

  const [employmentType, setEmploymentType] = useState<Option | Option[]>([]);
  const employmentTypes = [
    {
      value: 'HYBRID',
      label: 'Hybrid',
    },
    {
      value: 'FULL_TIME',
      label: 'Full Time',
    },
    {
      value: 'REMOTE',
      label: 'Remote',
    },
    {
      value: 'ON_SITE',
      label: 'On Site',
    },
    {
      value: 'CONTRACT',
      label: 'Contract',
    },
    {
      value: 'INTERNSHIP',
      label: 'INTERNSHIP',
    },
    {
      value: 'PART_TIME',
      label: 'Part Time',
    },
    { value: 'TEMPORARY', label: 'TEMPORARY' },
    { value: 'FREELANCE', label: 'Freelance' },
    { value: 'VOLUNTEER', label: 'Volunteer' },
    { value: 'ORTHER', label: 'Other' },
  ];

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-2 gap-6">
          <FormSelectInput
            options={employmentTypes}
            label="Employment Type"
            option={employmentType}
            setOption={setEmploymentType}
            model="employmentType"
            isSearchable={false}
            disabled={!isEditing}
          />

          <CustomText
            label="Department"
            register={register}
            name="department"
            errors={errors}
            placeholder="Eg; IT"
            disabled={!isEditing}
            className="w-full"
          />
          <CustomText
            label="Position"
            register={register}
            name="position"
            errors={errors}
            placeholder="Eg; Mananger"
            disabled={!isEditing}
            className="w-full"
          />
          <CustomText
            label="Reporting Manager"
            register={register}
            name="reportingManager"
            errors={errors}
            placeholder="Eg; Moses Kisakye"
            disabled={!isEditing}
            className="w-full"
          />
          <CustomText
            label="Work Location"
            register={register}
            name="workLocation"
            errors={errors}
            placeholder="Eg; Kireka"
            disabled={!isEditing}
            className="w-full"
          />

          <div className="flex w-full justify-between gap-4">
            {/* Start Time */}
            <div className="space-y-1">
              <span className="font-medium">Start Time</span>
              <div
                className={
                  isEditing
                    ? 'cursor-pointer'
                    : 'opacity-50 pointer-events-none'
                }
              >
                <TimePicker12Demo date={startDate} setDate={setStartDate} />
              </div>
            </div>

            {/* End Time */}
            <div className="space-y-1">
              <span className="font-medium">End Time</span>
              <div
                className={
                  isEditing
                    ? 'cursor-pointer'
                    : 'opacity-50 pointer-events-none'
                }
              >
                <TimePicker12Demo date={endDate} setDate={setEndDate} />
              </div>
            </div>
          </div>
          <CustomText
            label="Days per Week"
            register={register}
            name="daysPerWeek"
            errors={errors}
            type="number"
            placeholder="Eg; 6"
            disabled={!isEditing}
            className="w-full"
          />

          <CustomText
            label="Probation Period (months)"
            register={register}
            name="probationPeriod"
            errors={errors}
            type="number"
            placeholder="Eg; 19(months)"
            disabled={!isEditing}
            className="w-full"
          />

          <CustomText
            label="Contract Duration (months)"
            register={register}
            name="contractDuration"
            errors={errors}
            type="number"
            placeholder="Eg; 20(months)"
            disabled={!isEditing}
            className="w-full"
          />

          <CustomTextArea
            label="Responsibilities"
            register={register}
            name="responsibilities"
            errors={errors}
            height={8}
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
