import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';

type TextAreaProps = {
  register: any;
  errors: any;
  label: string;
  name: string;
  helperText?: string;
  height?: number; // Add new height prop
};

export default function CustomTextArea({
  register,
  errors,
  label,
  name,
  helperText = '',
  height = 3, // Default height of 3 rows
}: TextAreaProps) {
  return (
    <div className="col-span-full">
      <label
        htmlFor={name}
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        {label}
      </label>
      <div className="mt-2">
        <Textarea
          id={name}
          {...register(`${name}`, { required: true })}
          rows={height} // Use the height prop here
          className={cn(
            'block w-full border-brandBlack',
            errors[`${name}`] && 'focus:ring-red-500',
          )}
        />
        {errors[`${name}`] && (
          <span className="text-sm text-red-600">Description is required</span>
        )}
      </div>
      {helperText && (
        <p className="mt-1 text-sm leading-6 text-gray-600">{helperText}</p>
      )}
    </div>
  );
}
