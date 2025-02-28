import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type TextInputProps = {
  label: string;
  register: any;
  name: string;
  errors: any;
  type?: string;
  page?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  isRequired?: boolean;
};

export default function CustomText({
  label,
  register,
  name,
  errors,
  type = 'text',
  placeholder,
  disabled = false,
  isRequired = true,
  page,
  className = 'col-span-full',
}: TextInputProps) {
  return (
    <div className={cn('grid gap-2', className)}>
      {type === 'password' && page === 'login' ? (
        <div className="flex items-center">
          <Label htmlFor={`${name}`} className="">
            {label}
          </Label>
          <Link
            href="/forgot-password"
            className="ml-auto inline-block text-sm underline"
          >
            Forgot your password?
          </Link>
        </div>
      ) : (
        <Label className="text-sm font-medium" htmlFor={`${name}`}>
          {' '}
          {label}
        </Label>
      )}

      {type === 'phone' ? (
        <div className="flex">
          <div className="flex items-center justify-center px-3 border border-r-0 rounded-l-md border-brandBorder bg-transparent">
            +256
          </div>
          <Input
            disabled={disabled}
            {...register(`${name}`, { required: isRequired })}
            id={`${name}`}
            name={`${name}`}
            type="tel"
            autoComplete="tel"
            placeholder={placeholder ? placeholder : ''}
            className="bg-transparent border-brandBorder rounded-l-none"
          />
        </div>
      ) : (
        <Input
          disabled={disabled}
          {...register(`${name}`, { required: true })}
          id={`${name}`}
          name={`${name}`}
          type={type}
          autoComplete="name"
          placeholder={placeholder ? placeholder : ''}
          className="bg-transparent border-brandBorder"
        />
      )}

      {errors[`${name}`] && (
        <span className="text-red-600 text-sm">{label} is required</span>
      )}
    </div>
  );
}
