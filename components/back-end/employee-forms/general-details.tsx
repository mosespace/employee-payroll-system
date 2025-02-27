'use client';

import { User } from '@prisma/client';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { updateEmployee } from '@/actions/employees';
import CustomDatePicker from '@/components/back-end/re-usable-inputs/custom-date-picker';
import CustomText from '@/components/back-end/re-usable-inputs/text-reusable';
import { toast } from '@mosespace/toast';
import { useEffect, useState } from 'react';
import Select from 'react-tailwindcss-select';
import { Option } from 'react-tailwindcss-select/dist/components/type';
import Submit from './submit';

type FormValues = z.infer<any>;

interface GeneralDetailsProps {
  isEditing: boolean;
  data?: User | null | undefined;
}

export function GeneralDetails({ isEditing, data }: GeneralDetailsProps) {
  const [maritalStatus, setMaritalStatus] = useState<Option | null>(null);
  const [gender, setGender] = useState<Option | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const genders = [
    { value: 'MALE', label: 'Male' },
    { value: 'FEMALE', label: 'Female' },
    { value: 'OTHER', label: 'Other' },
  ];
  const maritalStatuses = [
    { value: 'STUDENT', label: 'Student' },
    { value: 'SINGLE', label: 'Single' },
    { value: 'MARRIED', label: 'Married' },
    { value: 'DIVORCED', label: 'Divorced' },
    { value: 'WIDOWED', label: 'Widowed' },
  ];

  // Initialize selections based on data when component mounts
  useEffect(() => {
    if (data) {
      // Set marital status
      if (data.maritalStatus) {
        const matchedType = maritalStatuses.find(
          (opt) => opt.value === data.employmentType,
        );
        if (matchedType) {
          setMaritalStatus(matchedType);
        }
      }

      // Set gender
      if (data.department) {
        const matchedGender = genders.find(
          (dept) => dept.value === data.department,
        );
        if (matchedGender) {
          setGender(matchedGender);
        }
      }
    }
  }, [data]);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<any>({
    defaultValues: {
      nationality: data?.nationality,
      gender: data?.gender,
      maritalStatus: data?.maritalStatus,
      bloodGroup: data?.bloodGroup,
      dateOfBirth: data?.dateOfBirth,
      postCode: data?.postCode,
      streetAddress: data?.streetAddress,
      city: data?.city,
      state: data?.state,
      country: data?.country,
      personalEmail: data?.personalEmail,
      phoneNumber: data?.phoneNumber,
    },
  });

  const employeeId = data?.id;
  async function onSubmit(formData: FormValues) {
    // console.log('FormData ✅:', formData);

    try {
      setLoading(true);
      const dataToSubmit = {
        ...formData,
        maritalStatus: maritalStatus?.value || '',
        gender: gender?.value || '',
      };

      // console.log('Data to be sent:', dataToSubmit);

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
            label="Nationality"
            register={register}
            name="nationality"
            errors={errors}
            placeholder="Eg; Ugandan"
            disabled={!isEditing}
            className="w-full"
          />

          <div>
            <h2 className="pb-2 block text-sm font-medium leading-6">Gender</h2>
            <Select
              value={gender}
              onChange={(option) => setGender(option as Option)}
              options={genders}
              isClearable={true}
              isDisabled={!isEditing}
              primaryColor="emerald"
              isSearchable={false}
              placeholder="Select Gender"
            />
          </div>

          <div>
            <h2 className="pb-2 block text-sm font-medium leading-6">
              Marital Status
            </h2>
            <Select
              value={maritalStatus}
              onChange={(option) => setMaritalStatus(option as Option)}
              options={maritalStatuses}
              isClearable={true}
              isDisabled={!isEditing}
              primaryColor="emerald"
              isSearchable={false}
              placeholder="Select Marital Status"
            />
          </div>

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
              name="streetAddress"
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
        {isEditing && <Submit loading={loading} />}
      </form>
    </div>
  );
}
