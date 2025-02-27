'use client';

import { User } from '@prisma/client';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { updateEmployee } from '@/actions/employees';
import Submit from '@/components/back-end/employee-forms/submit';
import CustomTextArea from '@/components/back-end/re-usable-inputs/custom-text-area';
import CustomText from '@/components/back-end/re-usable-inputs/text-reusable';
import { TimePicker12Demo } from '@/components/back-end/re-usable-inputs/time-picker/time-picker';
import { toast } from '@mosespace/toast';
import Select from 'react-tailwindcss-select';
import { Option } from 'react-tailwindcss-select/dist/components/type';

interface OfficialDetailsProps {
  isEditing: boolean;
  data?: User | null | undefined;
  managersAndAdmins?: Option[] | null;
}

export function OfficialDetails({
  isEditing,
  managersAndAdmins,
  data,
}: OfficialDetailsProps) {
  const [loading, setLoading] = useState<boolean>(false);

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

  const [employmentOption, setEmploymentOption] = useState<Option | null>(null);
  const [departmentOption, setDepartmentOption] = useState<Option | null>(null);
  const [reportingManager, setReportingManager] = useState<Option | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<any>({
    defaultValues: {
      location: data?.location,
      mobileNo: data?.mobileNo,
      changeReason: data?.changeReason,
      designation: data?.designation,
      email: data?.email,
      position: data?.position,
      contractDuration: data?.contractDuration,
      daysPerWeek: data?.daysPerWeek,
      responsibilities: data?.responsibilities,
      // otherEmployment: data?.otherEmployment,
    },
  });

  // Watch for "OTHER" department to show custom field
  const watchDepartment = departmentOption?.value === 'OTHER';

  // Watch for "OTHER" department to show custom field
  const watchEmployment = employmentOption?.value === 'OTHER';
  // Time picker state management
  const [startDate, setStartDate] = useState<Date | undefined>(
    data?.checkInTime ? new Date(data.checkInTime) : new Date(),
  );

  const [endDate, setEndDate] = useState<Date | undefined>(
    data?.checkOutTime ? new Date(data.checkOutTime) : new Date(),
  );

  // Initialize selections based on data when component mounts
  useEffect(() => {
    if (data) {
      // Set employment type
      if (data.employmentType) {
        const matchedType = options.find(
          (opt) => opt.value === data.employmentType,
        );
        if (matchedType) {
          setEmploymentOption(matchedType);
        }
      }

      // set reporting manager
      // Set employment type
      if (data.reportingManagerId) {
        const matchedType = managersAndAdmins?.find(
          (opt) => opt.value === data.reportingManagerId,
        );
        if (matchedType) {
          setReportingManager(matchedType);
        }
      }

      // Set department
      if (data.department) {
        const matchedDept = departments.find(
          (dept) => dept.value === data.department,
        );
        if (matchedDept) {
          setDepartmentOption(matchedDept);
        }
      }
    }
  }, [data]);

  const employeeId = data?.id;

  async function onSubmit(formData: any) {
    // console.log('FormData ✅:', formData);

    try {
      setLoading(true);
      const dataToSubmit = {
        ...formData,
        employmentType: employmentOption?.value || '',
        department: departmentOption?.value || '',
        checkInTime: startDate?.toISOString(),
        checkOutTime: endDate?.toISOString(),
        daysPerWeek: parseInt(formData.daysPerWeek) || 0,
        contractDuration: parseInt(formData.contractDuration) || 0,
        reportingManagerId: reportingManager?.value,
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
        <div className="grid gap-6">
          <div className="grid grid-cols-2 gap-4"></div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h2 className="pb-2 block text-sm font-medium leading-6">
                Employment Type
              </h2>
              <Select
                value={employmentOption}
                onChange={(option) => setEmploymentOption(option as Option)}
                options={options}
                isClearable={true}
                isDisabled={!isEditing}
                primaryColor="emerald"
                isSearchable={false}
                placeholder="Select Employment Type"
              />
            </div>

            {watchEmployment && (
              <div className="mt-2 w-full">
                <CustomText
                  label="Specify Employment"
                  register={register}
                  name="otherEmployment"
                  errors={errors}
                  placeholder="Enter employment type"
                  disabled={!isEditing}
                  className="w-full"
                />
              </div>
            )}

            <CustomText
              label="Designation"
              register={register}
              name="designation"
              errors={errors}
              placeholder="Eg; Team Lead"
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
            <div>
              <h2 className="pb-2 block text-sm font-medium leading-6">
                Department
              </h2>
              <Select
                value={departmentOption}
                onChange={(option) => setDepartmentOption(option as Option)}
                isSearchable={true}
                isClearable={true}
                options={departments}
                isDisabled={!isEditing}
                primaryColor="emerald"
                placeholder="Select Department"
              />
            </div>
          </div>
          {/* Show this field only when "OTHER" is selected */}
          {watchDepartment && (
            <div className="mt-2 w-full">
              <CustomText
                label="Specify Department"
                register={register}
                name="otherDepartment"
                errors={errors}
                placeholder="Enter department"
                disabled={!isEditing}
                className="w-full"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <CustomText
              label="Mobile No."
              register={register}
              name="mobileNo"
              type="phone"
              errors={errors}
              placeholder="Eg; 770-000-00"
              disabled={!isEditing}
              className="w-full"
            />

            <CustomText
              label="Official Email Id"
              register={register}
              name="email"
              errors={errors}
              type="email"
              placeholder="Eg; email@xample.com"
              disabled={true}
              className="w-full"
            />
          </div>
          <div className="grid gap-4">
            <CustomTextArea
              label="Responsibilities"
              register={register}
              name="responsibilities"
              errors={errors}
              height={8}
              disabled={!isEditing}
            />
          </div>
          <div className="grid spacey-3 gap-3">
            <div>
              <h2 className="pb-2 block text-sm font-medium leading-6">
                Reporting Manager
              </h2>
              <Select
                value={reportingManager}
                onChange={(option) => setReportingManager(option as Option)}
                options={managersAndAdmins || []}
                isClearable={true}
                isDisabled={!isEditing}
                primaryColor="emerald"
                isSearchable={true}
                placeholder="Select Manager"
              />
            </div>
            <CustomText
              label="Position"
              register={register}
              name="position"
              errors={errors}
              placeholder="Eg; Manager"
              disabled={!isEditing}
              className="w-full"
            />
            <CustomText
              label="Days Per Week"
              register={register}
              name="daysPerWeek"
              errors={errors}
              type="number"
              placeholder="Eg; 12 (Days)"
              disabled={!isEditing}
              className="w-full"
            />
            <CustomText
              label="Contract Duration"
              register={register}
              name="contractDuration"
              type="number"
              errors={errors}
              placeholder="Eg; 12 (Months)"
              disabled={!isEditing}
              className="w-full"
            />
          </div>

          <div className="flex w-full justify-between gap-4">
            {/* Start Time */}

            {isEditing && (
              <div className="space-y-1">
                <span className="font-medium">Start Time</span>
                <div>
                  <TimePicker12Demo date={startDate} setDate={setStartDate} />
                </div>
              </div>
            )}

            {/* End Time */}
            {isEditing && (
              <div className="space-y-1">
                <span className="font-medium">End Time</span>
                <div>
                  <TimePicker12Demo date={endDate} setDate={setEndDate} />
                </div>
              </div>
            )}
          </div>

          <CustomTextArea
            register={register}
            errors={errors}
            label="Change Reason"
            name="changeReason"
            height={6}
            disabled={!isEditing}
          />
        </div>
        {isEditing && <Submit loading={loading} />}
      </form>
    </div>
  );
}
