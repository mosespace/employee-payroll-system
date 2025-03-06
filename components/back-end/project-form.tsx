'use client';

import { useRouter } from 'next/navigation';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import type { EmployeeBasic } from '@/actions/employees';
import { createProject, updateProject } from '@/actions/projects';
import { toast } from '@mosespace/toast';
import Select from 'react-tailwindcss-select';
import { Option } from 'react-tailwindcss-select/dist/components/type';
import Submit from './employee-forms/submit';
import CustomDatePicker from './re-usable-inputs/custom-date-picker';
import CustomTextArea from './re-usable-inputs/custom-text-area';
import CustomText from './re-usable-inputs/text-reusable';

// const formSchema = z.object({
//   name: z.string().min(3, {
//     message: 'Project name must be at least 3 characters.',
//   }),
//   description: z.string().optional(),
//   client: z.string().min(2, {
//     message: 'Client name must be at least 2 characters.',
//   }),
//   budget: z.coerce.number().min(0, {
//     message: 'Budget must be a positive number.',
//   }),
//   startDate: z.date({
//     required_error: 'Start date is required.',
//   }),
//   endDate: z.date().optional(),
//   projectStatus: z.enum(['ONGOING', 'COMPLETED', 'CANCELLED'], {
//     required_error: 'Please select a project projectStatus.',
//   }),
//   assignedEmployeeIds: z.array(z.string()).optional(),
// });

type ProjectFormValues = z.infer<any>;

interface ProjectFormProps {
  project?: any; // Replace with your project type
  user?: any; // Replace with your project type
  employees: EmployeeBasic[];
}

export function ProjectForm({ project, employees, user }: ProjectFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [projectStatus, setProjectStatus] = React.useState<Option | null>(null);
  const [employee, setEmployee] = React.useState<Option | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<any>({
    defaultValues: {
      ...project,
    },
  });

  const options = [
    {
      value: 'ONGOING',
      label: 'On Going',
    },
    {
      value: 'COMPLETED',
      label: 'Completed',
    },
    {
      value: 'CANCELED',
      label: 'Canceled',
    },
  ];

  async function onSubmit(formData: any) {
    setIsSubmitting(true);
    const employeeId = user?.id;

    const dataToSubmit = {
      employeeId: employees ? employee?.value : employeeId,
      ...formData,
      status: projectStatus?.value,
      budget: parseFloat(formData?.budget),
    };
    // console.log('Data to-be submitted;', dataToSubmit);
    try {
      if (project?.id) {
        const res = await updateProject(project.id, dataToSubmit);
        if (res.status === 201) {
          toast.success(
            'Success:',
            'Project updated successfully, redirecting to projects page',
          );
          router.push('/dashboard/projects');
        } else {
          toast.error('Error:', 'Project update failed');
        }
      } else {
        const res = await createProject(dataToSubmit);
        if (res.status === 201) {
          toast.success(
            'Success:',
            'Project created successfully, redirecting to projects page',
          );
          router.push('/dashboard/projects');
        } else {
          toast.error('Error:', 'Project creation failed');
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Error:', 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  }

  // Initialize selections based on project when component mounts
  React.useEffect(() => {
    if (project) {
      // Set employment type
      if (project.status) {
        const matchedType = options.find((opt) => opt.value === project.status);
        if (matchedType) {
          setProjectStatus(matchedType);
        }
      }
    }
  }, [project]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8 bg-white p-6 rounded-lg border shadow-sm"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CustomText
          label="Project Title"
          register={register}
          name="name"
          errors={errors}
          placeholder=""
          disabled={isSubmitting}
          className="w-full"
        />

        <CustomText
          label="Client Name"
          register={register}
          name="clientName"
          errors={errors}
          placeholder=""
          disabled={isSubmitting}
          className="w-full"
        />
      </div>

      <CustomTextArea
        label="Project Description"
        register={register}
        name="description"
        errors={errors}
        disabled={isSubmitting}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <CustomDatePicker
          label="Start Date"
          name="startDate"
          control={control}
          errors={errors}
          className=""
        />

        <CustomDatePicker
          label="End Date"
          name="endDate"
          control={control}
          errors={errors}
          className=""
        />

        <CustomText
          label="Project Beget"
          register={register}
          name="budget"
          errors={errors}
          type="currency"
          currency="UGX"
          placeholder=""
          disabled={isSubmitting}
          className="w-full"
        />
      </div>

      <div className="grid md:grid-cols-2 w-full gap-2">
        <div>
          <h2 className="pb-2 block text-sm font-medium leading-6">
            Project Status
          </h2>
          <Select
            value={projectStatus}
            onChange={(option) => setProjectStatus(option as Option)}
            options={options}
            isClearable={true}
            isDisabled={isSubmitting}
            primaryColor="emerald"
            isSearchable={false}
            placeholder="Select Project projectStatus"
          />
        </div>
        {user?.role === 'MANAGER' && user?.role === 'ADMIN' && (
          <div>
            <h2 className="pb-2 block text-sm font-medium leading-6">
              Select Employee
            </h2>
            <Select
              value={employee}
              onChange={(option) => setEmployee(option as Option)}
              options={employees}
              isClearable={true}
              isDisabled={isSubmitting}
              primaryColor="emerald"
              isSearchable={false}
              placeholder="Select Employees"
            />
          </div>
        )}
      </div>

      <div className="flex justify-end gap-4">
        <Submit
          loadingTitle="Creating project"
          title="Create Project"
          loading={isSubmitting}
        />
      </div>
    </form>
  );
}
