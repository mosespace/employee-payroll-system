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
  separationType: z.enum([
    'RESIGNATION',
    'TERMINATION',
    'RETIREMENT',
    'LAYOFF',
  ]),
  effectiveDate: z.string().min(1, 'Effective date is required'),
  reason: z.string().min(1, 'Reason is required'),
  noticePeriod: z.number().min(0, 'Notice period must be a positive number'),
  exitInterviewDate: z.string().optional(),
  clearanceStatus: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED']),
  remarks: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface SeparationDetailsProps {
  isEditing: boolean;
  employeeId: string;
}

export function SeparationDetails({
  isEditing,
  employeeId,
}: SeparationDetailsProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clearanceStatus: 'PENDING',
      remarks: '',
    },
  });

  async function onSubmit(data: FormValues) {
    try {
      const response = await fetch(`/api/employees/${employeeId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ separation: data }),
      });
      if (!response.ok) throw new Error('Failed to update');
    } catch (error) {
      console.error('Error updating separation details:', error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="separationType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Separation Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={!isEditing}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select separation type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="RESIGNATION">Resignation</SelectItem>
                    <SelectItem value="TERMINATION">Termination</SelectItem>
                    <SelectItem value="RETIREMENT">Retirement</SelectItem>
                    <SelectItem value="LAYOFF">Layoff</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="effectiveDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Effective Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} disabled={!isEditing} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="noticePeriod"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notice Period (days)</FormLabel>
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
            name="exitInterviewDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Exit Interview Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} disabled={!isEditing} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="clearanceStatus"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Clearance Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={!isEditing}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="reason"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Reason</FormLabel>
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
          <FormField
            control={form.control}
            name="remarks"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Remarks</FormLabel>
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
