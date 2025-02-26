'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
  employmentType: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERN']),
  department: z.string().min(1, 'Department is required'),
  position: z.string().min(1, 'Position is required'),
  reportingManager: z.string().min(1, 'Reporting manager is required'),
  workLocation: z.string().min(1, 'Work location is required'),
  workSchedule: z.object({
    startTime: z.string(),
    endTime: z.string(),
    daysPerWeek: z.number().min(1).max(7),
  }),
  probationPeriod: z.number().optional(),
  contractDuration: z.number().optional(),
  responsibilities: z.string().min(1, 'Responsibilities are required'),
});

type FormValues = z.infer<typeof formSchema>;

interface EmploymentDetailsProps {
  isEditing: boolean;
  employeeId: string;
}

export function EmploymentDetails({
  isEditing,
  employeeId,
}: EmploymentDetailsProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      workSchedule: {
        startTime: '09:00',
        endTime: '17:00',
        daysPerWeek: 5,
      },
      probationPeriod: 3,
      responsibilities: '',
    },
  });

  async function onSubmit(data: FormValues) {
    try {
      const response = await fetch(`/api/employees/${employeeId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ employment: data }),
      });
      if (!response.ok) throw new Error('Failed to update');
    } catch (error) {
      console.error('Error updating employment details:', error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="employmentType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Employment Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={!isEditing}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select employment type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="FULL_TIME">Full Time</SelectItem>
                    <SelectItem value="PART_TIME">Part Time</SelectItem>
                    <SelectItem value="CONTRACT">Contract</SelectItem>
                    <SelectItem value="INTERN">Intern</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="department"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Department</FormLabel>
                <FormControl>
                  <Input {...field} disabled={!isEditing} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="position"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Position</FormLabel>
                <FormControl>
                  <Input {...field} disabled={!isEditing} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="reportingManager"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reporting Manager</FormLabel>
                <FormControl>
                  <Input {...field} disabled={!isEditing} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="workLocation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Work Location</FormLabel>
                <FormControl>
                  <Input {...field} disabled={!isEditing} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="col-span-2 grid grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="workSchedule.startTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Time</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} disabled={!isEditing} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="workSchedule.endTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Time</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} disabled={!isEditing} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="workSchedule.daysPerWeek"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Days per Week</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      max={7}
                      {...field}
                      onChange={(e) =>
                        field.onChange(Number.parseInt(e.target.value))
                      }
                      disabled={!isEditing}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="probationPeriod"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Probation Period (months)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) =>
                      field.onChange(Number.parseInt(e.target.value))
                    }
                    disabled={!isEditing}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="contractDuration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contract Duration (months)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) =>
                      field.onChange(Number.parseInt(e.target.value))
                    }
                    disabled={!isEditing}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="responsibilities"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Responsibilities</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    disabled={!isEditing}
                    className="min-h-[100px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {isEditing && (
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
            >
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        )}
      </form>
    </Form>
  );
}
