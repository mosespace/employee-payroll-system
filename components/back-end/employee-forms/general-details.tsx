'use client';

import type { User } from '@prisma/client';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import CustomDatePicker from '@/components/back-end/re-usable-inputs/custom-date-picker';
import FormSelectInput from '@/components/back-end/re-usable-inputs/select-input';
import CustomText from '@/components/back-end/re-usable-inputs/text-reusable';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Option } from 'react-tailwindcss-select/dist/components/type';

const formSchema = z.object({
  nationality: z.string().min(1, 'Nationality is required'),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  maritalStatus: z.enum(['SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED']),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  bloodGroup: z.string().optional(),
  address: z.object({
    street: z.string().min(1, 'Street address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    country: z.string().min(1, 'Country is required'),
    postalCode: z.string().min(1, 'Postal code is required'),
  }),
  personalEmail: z.string().email('Invalid email address'),
  phoneNumber: z.string().min(1, 'Phone number is required'),
});

type FormValues = z.infer<typeof formSchema>;

interface GeneralDetailsProps {
  isEditing: boolean;
  employee: User;
}

export function GeneralDetails({ isEditing, employee }: GeneralDetailsProps) {
  const [maritalStatus, setMaritalStatus] = useState<Option | Option[]>([]);
  const [gender, setGender] = useState<Option | Option[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    control,
    formState: { errors },
  } = useForm<any>({
    // resolver: zodResolver(formSchema),
    defaultValues: {
      ...employee,
    },
  });

  async function onSubmit(data: FormValues) {
    try {
      const response = await fetch(`/api/employees/${employee?.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update');
    } catch (error) {
      console.error('Error updating general details:', error);
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-2 gap-6">
          <CustomText
            label="Nationality"
            register={register}
            name="nationality"
            errors={errors}
            placeholder="Eg; Ugandan"
            disabled={!isEditing}
            className="w-full"
          />

          <FormSelectInput
            options={[
              { value: 'MALE', label: 'Male' },
              { value: 'FEMALE', label: 'Female' },
              { value: 'OTHER', label: 'Other' },
            ]}
            label="Gender"
            option={gender}
            setOption={setGender}
            model="gender"
            isSearchable={false}
            disabled={!isEditing}
          />
          <FormSelectInput
            options={[
              { value: 'STUDENT', label: 'Student' },
              { value: 'SINGLE', label: 'Single' },
              { value: 'MARRIED', label: 'Married' },
              { value: 'DIVORCED', label: 'Divorced' },
              { value: 'WIDOWED', label: 'Widowed' },
            ]}
            label="Marital Status"
            option={maritalStatus}
            setOption={setMaritalStatus}
            model="gender"
            isSearchable={false}
            disabled={!isEditing}
          />
          <CustomText
            label="Blood Group"
            register={register}
            name="bloodGroup"
            errors={errors}
            placeholder="Eg; o+"
            disabled={!isEditing}
            className="w-full"
          />
          <CustomDatePicker
            label="Date Of Birth"
            name="dateOfBirth"
            control={control}
            errors={errors}
            className=""
          />

          <CustomText
            label="Post Code"
            register={register}
            name="postCode"
            errors={errors}
            placeholder="Eg; HA410UN"
            disabled={!isEditing}
            className="w-full"
          />
          <div className="col-span-2 grid grid-cols-2 gap-4">
            <CustomText
              label="Street Address"
              register={register}
              name="address"
              errors={errors}
              placeholder="Eg; Kabaka Road"
              disabled={!isEditing}
              className="w-full"
            />
            <CustomText
              label="City"
              register={register}
              name="city"
              errors={errors}
              placeholder="Eg; Namanve"
              disabled={!isEditing}
              className="w-full"
            />
            <CustomText
              label="State"
              register={register}
              name="state"
              errors={errors}
              placeholder="Eg; Ruislip"
              disabled={!isEditing}
              className="w-full"
            />
            <CustomText
              label="Country"
              register={register}
              name="country"
              errors={errors}
              placeholder="Eg; Uganda"
              disabled={!isEditing}
              className="w-full"
            />
          </div>
          <CustomText
            label="Personal Email"
            register={register}
            name="personalEmail"
            errors={errors}
            type="email"
            placeholder="Eg; email@example.com"
            disabled={!isEditing}
            className="w-full"
          />
          <CustomText
            label="Personal Phone Number"
            register={register}
            name="phoneNumber"
            errors={errors}
            type=""
            placeholder="Eg; +256-770-000-000"
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
