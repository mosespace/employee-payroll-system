'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { createProject, updateProject } from '@/actions/projects';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import type { EmployeeBasic } from '@/actions/employees';

const formSchema = z.object({
  name: z.string().min(3, {
    message: 'Project name must be at least 3 characters.',
  }),
  description: z.string().optional(),
  client: z.string().min(2, {
    message: 'Client name must be at least 2 characters.',
  }),
  budget: z.coerce.number().min(0, {
    message: 'Budget must be a positive number.',
  }),
  startDate: z.date({
    required_error: 'Start date is required.',
  }),
  endDate: z.date().optional(),
  status: z.enum(['ONGOING', 'COMPLETED', 'CANCELLED'], {
    required_error: 'Please select a project status.',
  }),
  assignedEmployeeIds: z.array(z.string()).optional(),
});

type ProjectFormValues = z.infer<typeof formSchema>;

interface ProjectFormProps {
  project?: any; // Replace with your project type
  employees: EmployeeBasic[];
}

export function ProjectForm({ project, employees }: ProjectFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Default values for the form
  const defaultValues: Partial<ProjectFormValues> = {
    name: project?.name || '',
    description: project?.description || '',
    client: project?.client || '',
    budget: project?.budget || 0,
    startDate: project?.startDate ? new Date(project.startDate) : new Date(),
    endDate: project?.endDate ? new Date(project.endDate) : undefined,
    status: project?.status || 'ONGOING',
    assignedEmployeeIds: project?.assignedEmployeeIds || [],
  };

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  async function onSubmit(values: ProjectFormValues) {
    setIsSubmitting(true);

    try {
      const formData = new FormData();

      // Add form values to FormData
      Object.entries(values).forEach(([key, value]) => {
        if (key === 'assignedEmployeeIds' && Array.isArray(value)) {
          value.forEach((id) => formData.append(key, id));
        } else if (key === 'startDate' || key === 'endDate') {
          if (value) formData.append(key, value.toISOString() as any);
        } else if (value !== undefined) {
          formData.append(key, String(value));
        }
      });

      if (project?.id) {
        await updateProject(project.id, formData);
      } else {
        await createProject(formData);
      }

      router.push('/dashboard/projects');
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 bg-white p-6 rounded-lg border shadow-sm"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter project name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="client"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Client</FormLabel>
                <FormControl>
                  <Input placeholder="Enter client name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter project description"
                  className="resize-none"
                  {...field}
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Start Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-full pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground',
                        )}
                      >
                        {field.value ? (
                          format(field.value, 'PPP')
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>End Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-full pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground',
                        )}
                      >
                        {field.value ? (
                          format(field.value, 'PPP')
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                      disabled={(date) => date < form.getValues('startDate')}
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>Optional for ongoing projects</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="budget"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Budget</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      $
                    </span>
                    <Input className="pl-7" type="number" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select project status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="ONGOING">Active</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="assignedEmployeeIds"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Assigned Employees</FormLabel>
                <FormDescription>
                  Select the employees who will work on this project
                </FormDescription>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {employees.map((employee) => (
                  <FormField
                    key={employee.id}
                    control={form.control}
                    name="assignedEmployeeIds"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={employee.id}
                          className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(employee.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([
                                      ...(field.value || []),
                                      employee.id,
                                    ])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== employee.id,
                                      ),
                                    );
                              }}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-sm font-medium">
                              {employee.name}
                            </FormLabel>
                            <FormDescription className="text-xs">
                              {employee.position || employee.role}
                              {employee.department &&
                                ` • ${employee.department}`}
                            </FormDescription>
                          </div>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/dashboard/projects')}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {project ? 'Update Project' : 'Create Project'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
