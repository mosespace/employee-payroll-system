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
};

export default function CustomText({
  label,
  register,
  name,
  errors,
  type = 'text',
  placeholder,
  page,
  className = 'col-span-full text-white',
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

      <Input
        {...register(`${name}`, { required: true })}
        id={`${name}`}
        name={`${name}`}
        type={type}
        autoComplete="name"
        placeholder={placeholder ? placeholder : ''}
        className="bg-transparent border-brandBorder"
      />
      {errors[`${name}`] && (
        <span className="text-red-600  text-sm">{label} is required</span>
      )}
    </div>
  );
}
