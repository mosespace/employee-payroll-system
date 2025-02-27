'use client';

import { Leave, User } from '@prisma/client';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { updateEmployee } from '@/actions/employees';
import CustomDatePicker from '@/components/back-end/re-usable-inputs/custom-date-picker';
import CustomTextArea from '@/components/back-end/re-usable-inputs/custom-text-area';
import CustomText from '@/components/back-end/re-usable-inputs/text-reusable';
import { toast } from '@mosespace/toast';
import { useEffect, useState } from 'react';
import Select from 'react-tailwindcss-select';
import { Option } from 'react-tailwindcss-select/dist/components/type';
import { TimePicker12Demo } from '../re-usable-inputs/time-picker/time-picker';
import Submit from './submit';

type FormValues = z.infer<any>;

interface SeparationDetailsProps {
  isEditing: boolean;
  data?: (User & { leaves: Leave }) | null | undefined;
}

export function SeparationDetails({ isEditing, data }: SeparationDetailsProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [leaveType, setLeaveType] = useState<Option | null>(null);
  const [leaveStatus, setLeaveStatus] = useState<Option | null>(null);
  const [startDate, setStartDate] = useState<Date | undefined>(
    data?.checkInTime ? new Date(data.checkInTime) : new Date(),
  );

  const [endDate, setEndDate] = useState<Date | undefined>(
    data?.checkOutTime ? new Date(data.checkOutTime) : new Date(),
  );

  const {
    register,
    handleSubmit,
    watch,
    control,
    reset,
    formState: { errors },
  } = useForm<any>({
    defaultValues: {
      startDate: data?.leaves.startDate,
      endDate: data?.leaves.endDate,
      reason: data?.leaves.reason,
      noticePeriod: data?.leaves.noticePeriod,
      status: data?.leaves.status,
      approvedBy: data?.leaves.approvedBy,
      remarks: data?.leaves.remarks,
    },
  });

  const leaveTypes = [
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
  ];

  const status = [
    {
      value: 'PENDING',
      label: 'Pending',
    },
    {
      value: 'APPROVED',
      label: 'Approved',
    },
    { value: 'REJECTED', label: 'Rejected' },
  ];

  const employeeId = data?.id;
  async function onSubmit(formData: FormValues) {
    // console.log('FormData ✅:', formData);

    try {
      setLoading(true);
      const dataToSubmit = {
        leaves: {
          ...formData,
          startDate: startDate?.toISOString(),
          endDate: endDate?.toISOString(),
          noticePeriod: parseInt(formData.noticePeriod) || 0,
          status: leaveStatus?.value,
          leaveType: leaveType?.value,
        },
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

  // Initialize selections based on data when component mounts
  useEffect(() => {
    if (data) {
      // Set leave type
      if (data.leaves.leaveType) {
        const matchedType = leaveTypes.find(
          (opt) => opt.value === data.leaves.leaveType,
        );
        if (matchedType) {
          setLeaveType(matchedType);
        }
      }

      // Set leave status
      if (data.leaves.status) {
        const matchedType = status?.find(
          (opt) => opt.value === data.leaves.status,
        );
        if (matchedType) {
          setLeaveStatus(matchedType);
        }
      }
    }
  }, [data]);

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div>
          <h2 className="pb-2 block w-full text-sm font-medium leading-6">
            Select Leave Type
          </h2>
          <Select
            value={leaveType}
            onChange={(option) => setLeaveType(option as Option)}
            options={leaveTypes}
            isClearable={true}
            isDisabled={!isEditing}
            primaryColor="emerald"
            isSearchable={false}
            placeholder="Select Leave"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
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
            type="number"
            placeholder="Eg; 12 (days)"
            disabled={!isEditing}
            className="w-full"
          />
          {/* start time */}
          {isEditing && (
            <div className="space-y-1">
              <span className="font-medium">Start Time</span>
              <div>
                <TimePicker12Demo date={startDate} setDate={setStartDate} />
              </div>
            </div>
          )}

          {/* end time */}
          {isEditing && (
            <div className="space-y-1">
              <span className="font-medium">End Time</span>
              <div>
                <TimePicker12Demo date={endDate} setDate={setEndDate} />
              </div>
            </div>
          )}
        </div>

        <div>
          <h2 className="pb-2 w-full block text-sm font-medium leading-6">
            Select Leave Status
          </h2>
          <Select
            value={leaveStatus}
            onChange={(option) => setLeaveStatus(option as Option)}
            options={status}
            isClearable={true}
            isDisabled={!isEditing}
            primaryColor="emerald"
            isSearchable={false}
            placeholder="Select status"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
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

        {isEditing && <Submit loading={loading} />}
      </form>
    </div>
  );
}
