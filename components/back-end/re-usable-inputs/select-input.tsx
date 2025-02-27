'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
// import { Campus, Category } from '@prisma/client';
import { PlusCircle } from 'lucide-react';
import { useMemo } from 'react';
import Select from 'react-tailwindcss-select';
import { Option, Options } from 'react-tailwindcss-select/dist/components/type';
// import CampusForm from '../forms/campus-form';
// import CategoryForm from '../forms/category-form';
// import CourseForm from '../forms/course-form';
import { cn } from '@/lib/utils';

type FormSelectInputProps = {
  options: Options;
  label: string;
  option: Option | Option[];
  setOption: (value: Option | Option[]) => void;
  model?: string;
  labelShown?: boolean;
  isMultiple?: boolean;
  isSearchable?: boolean;
  toolTipText?: string;
  // categories?: Category[] | null;
  // campuses?: Campus[] | null;
  isDialogOpen?: boolean;
  isClearable?: boolean;
  disabled?: boolean;
  className?: string;
  onDialogOpenChange?: (open: boolean) => void;
};

export default function FormSelectInput({
  options,
  label,
  option,
  setOption,
  model,
  toolTipText,
  labelShown = true,
  isSearchable = true,
  isMultiple = false,
  disabled = false,
  isClearable = false,
  // categories,
  // campuses,
  isDialogOpen,
  className = '',
  onDialogOpenChange,
}: FormSelectInputProps) {
  const handleSelectAll = (selectedOption: Option | Option[] | null) => {
    if (!selectedOption) return;

    if (Array.isArray(selectedOption)) {
      const hasSelectAll = selectedOption.some(
        (item) => item.value === 'select-all',
      );
      const hasDeselectAll = selectedOption.some(
        (item) => item.value === 'deselect-all',
      );

      if (hasSelectAll) {
        const validOptions = options.filter(
          (opt): opt is Option => 'value' in opt,
        );
        setOption(validOptions);
      } else if (hasDeselectAll) {
        setOption([]);
      } else {
        setOption(selectedOption);
      }
    } else {
      setOption(selectedOption);
    }
  };

  const enhancedOptions = useMemo(() => {
    const hasSelectedOptions =
      isMultiple && Array.isArray(option) && option.length > 0;

    if (isMultiple) {
      return hasSelectedOptions
        ? [{ value: 'deselect-all', label: 'Deselect All' }, ...options]
        : [{ value: 'select-all', label: 'Select All' }, ...options];
    }

    return options;
  }, [isMultiple, option, options]);

  const renderForm = () => {
    switch (model) {
      case 'campus':
        return <> </>;

      // return <CampusForm />;
      case 'category':
        return <> </>;
      // return <CategoryForm />;
      case 'course':
        return (
          // <CourseForm
          //   categories={categories}
          //   campuses={campuses}
          //   onSuccess={() => onDialogOpenChange?.(false)}
          // />
          <></>
        );
      default:
        return null;
    }
  };

  return (
    <div className={cn(className)}>
      {labelShown && (
        <h2 className="pb-2 block text-sm font-medium leading-6">
          Select {label}
        </h2>
      )}
      <div className="flex items-center space-x-2 bg-transparent">
        <Select
          isDisabled={disabled}
          isClearable={isClearable}
          primaryColor={'emerald'}
          value={option}
          isMultiple={isMultiple}
          isSearchable={isSearchable}
          onChange={(item) => handleSelectAll(item)}
          options={enhancedOptions}
          placeholder={label}
        />
        {model && toolTipText && (
          <Dialog open={isDialogOpen} onOpenChange={onDialogOpenChange}>
            <DialogTrigger asChild>
              <Button size="sm" className="h-8 gap-1">
                <PlusCircle className="h-3.5 w-3.5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px]">
              <ScrollArea className="h-[600px]">
                <DialogHeader>
                  <DialogTitle>{toolTipText}</DialogTitle>
                </DialogHeader>
                {renderForm()}
              </ScrollArea>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}
