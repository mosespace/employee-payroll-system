'use client';

import React from 'react';
import { Controller, Control } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import { Label } from '@/components/ui/label';

import 'react-datepicker/dist/react-datepicker.css';

interface CustomDatePickerProps {
  label: string;
  name: string;
  control: Control<any>;
  errors: any;
  className?: string;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  label,
  name,
  control,
  errors,
  className = '',
}) => {
  return (
    <div className="flex flex-col space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <DatePicker
            selected={field.value}
            onChange={(date) => field.onChange(date)}
            dateFormat="MMMM d, yyyy"
            className={`w-full placeholder:text-black/60 p-2 border shadow-sm rounded-md ${className}`}
            placeholderText={`Select ${label.toLowerCase()}`}
            id={name}
          />
        )}
      />
      {errors[name] && (
        <p className="text-sm text-red-500">{errors[name].message}</p>
      )}
    </div>
  );
};

export default CustomDatePicker;
