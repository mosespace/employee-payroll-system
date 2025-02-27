'use client';

import type { User } from '@prisma/client';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import CustomTextArea from '@/components/back-end/re-usable-inputs/custom-text-area';
import FormSelectInput from '@/components/back-end/re-usable-inputs/select-input';
import CustomText from '@/components/back-end/re-usable-inputs/text-reusable';
import { Button } from '@/components/ui/button';
import { toast } from '@mosespace/toast';
import { Option } from 'react-tailwindcss-select/dist/components/type';
const formSchema = z.object({
  changeDate: z.date().optional(),
  wef: z.date().optional(),
  changeReason: z.string().optional(),
  company: z.string().min(1, 'Company is required'),
  employmentType: z.string().min(1, 'Employment type is required'),
  grade: z.string().min(1, 'Grade is required'),
  designation: z.string().min(1, 'Designation is required'),
  department: z.string().min(1, 'Department is required'),
  location: z.string().min(1, 'Location is required'),
  region: z.string().min(1, 'Region is required'),
  rolesResponsibilities: z.string().optional(),
  mobileNo: z.string().optional(),
  officialEmail: z.string().email('Invalid email address'),
});

type FormValues = z.infer<typeof formSchema>;

interface OfficialDetailsProps {
  isEditing: boolean;
  employee?: User;
}

export function OfficialDetails({ isEditing, employee }: OfficialDetailsProps) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<any>({
    // resolver: zodResolver(formSchema),
    defaultValues: {
      ...employee,
    },
  });

  // Update form when employee data changes
  useEffect(() => {
    if (employee) {
      // form.reset({
      //   // company: employee.company || '',
      //   employmentType: employee.employmentType || '',
      //   // grade: employee.grade || '',
      //   // designation: employee.designation || '',
      //   department: employee.department || '',
      //   location: employee.location || '',
      //   region: employee.region || '',
      //   // rolesResponsibilities: employee.rolesAndResponsibilities || '',
      //   mobileNo: employee.mobileNo || '',
      //   officialEmail: employee.email,
      //   // If you have these dates in your employee data, parse them:
      //   // changeDate: employee.changeDate
      //   // ? new Date(employee.changeDate)
      //   // : undefined,
      //   // wef: employee.wefDate ? new Date(employee.wefDate) : undefined,
      // });
    }
  }, [employee]);

  async function onSubmit(data: FormValues) {
    try {
      const response = await fetch(`/api/employees/${employee?.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update employee');
      }

      const updatedEmployee = await response.json();
      toast.success('Success', 'Employee details updated successfully');

      // Update form with new values
      reset(updatedEmployee);
    } catch (error) {
      toast.error('Error', 'Failed to update employee details');
      console.error('Error updating employee:', error);
    }
  }

  const options = [
    {
      value: 'FULL_TIME',
      label: 'Full Time',
    },
    {
      value: 'PART_TIME',
      label: 'Part Time',
    },
    {
      value: 'CONTRACT',
      label: 'Contract',
    },
    {
      value: 'TEMPORARY',
      label: 'Temporary',
    },
    {
      value: 'FREELANCE',
      label: 'Freelance',
    },
    {
      value: 'VOLUNTEER',
      label: 'Volunteer',
    },
    {
      value: 'HYBRID',
      label: 'Hybrid',
    },
    { value: 'INTERN', label: 'Intern' },
    { value: 'REMOTE', label: 'Remote' },
    {
      value: 'OTHER',
      label: 'Other',
    },
  ];

  const departments = [
    {
      value: 'HR',
      label: 'Human Resources',
    },
    {
      value: 'MARKETING',
      label: 'Marketing',
    },
    {
      value: 'SALES',
      label: 'Sales',
    },
    {
      value: 'ENGINEERING',
      label: 'Engineering',
    },
    {
      value: 'DESIGN',
      label: 'Design',
    },
    {
      value: 'FINANCE',
      label: 'Finance',
    },
    {
      value: 'LEGAL',
      label: 'Legal',
    },
    {
      value: 'CUSTOMER_SUPPORT',
      label: 'Customer Support',
    },
    {
      value: 'PRODUCT',
      label: 'Product',
    },
    {
      value: 'OPERATIONS',
      label: 'Operations',
    },
    {
      value: 'IT',
      label: 'Information Technology',
    },
    {
      value: 'OTHER',
      label: 'Other',
    },
  ];

  const [option, setOption] = useState<Option | Option[]>([]);

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-6">
          <div className="grid grid-cols-2 gap-4"></div>

          <div className="grid grid-cols-2 gap-4">
            <FormSelectInput
              options={options}
              label="Employment Type"
              option={option}
              setOption={setOption}
              model="employee"
              isSearchable={false}
              disabled={!isEditing}
            />

            <CustomText
              label="Designation"
              register={register}
              name="designation"
              errors={errors}
              placeholder="Eg; Software Engineer"
              disabled={!isEditing}
              className="w-full"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <CustomText
              label="Location"
              register={register}
              name="location"
              errors={errors}
              placeholder="Eg; Kireka, Uganda"
              disabled={!isEditing}
              className="w-full"
            />

            <FormSelectInput
              options={departments}
              label="Department"
              option={option}
              setOption={setOption}
              model="department"
              isSearchable={false}
              disabled={!isEditing}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <CustomText
              label="Region"
              register={register}
              name="region"
              errors={errors}
              placeholder="Eg; Nakawa, Uganda"
              disabled={!isEditing}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <CustomText
              label="Mobile No."
              register={register}
              name="mobileNo"
              errors={errors}
              placeholder="Eg; +256-770-000-000 Engineer"
              disabled={!isEditing}
              className="w-full"
            />

            <CustomText
              label="Official Email Id"
              register={register}
              name="officialEmail"
              errors={errors}
              type="email"
              placeholder="Eg; email@xample.com"
              disabled={!isEditing}
              className="w-full"
            />
          </div>
          <div className="grid gap-4">
            <CustomTextArea
              register={register}
              errors={errors}
              label="Change Reason"
              name="reason"
              height={6}
              disabled={!isEditing}
            />
          </div>
        </div>
        {isEditing && (
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              // onClick={() => form.reset()}
            >
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        )}
      </form>
    </div>
  );
}
