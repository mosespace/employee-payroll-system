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

const formSchema = z.object({
  panNumber: z.string().min(1, 'PAN number is required'),
  aadhaarNumber: z.string().min(1, 'Aadhaar number is required'),
  uanNumber: z.string().min(1, 'UAN number is required'),
  pfNumber: z.string().min(1, 'PF number is required'),
  esiNumber: z.string().optional(),
  taxId: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface StatutoryDetailsProps {
  isEditing: boolean;
  employeeId: string;
}

export function StatutoryDetails({
  isEditing,
  employeeId,
}: StatutoryDetailsProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      esiNumber: '',
      taxId: '',
    },
  });

  async function onSubmit(data: FormValues) {
    try {
      const response = await fetch(`/api/employees/${employeeId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ statutoryDetails: data }),
      });
      if (!response.ok) throw new Error('Failed to update');
    } catch (error) {
      console.error('Error updating statutory details:', error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="panNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>PAN Number</FormLabel>
                <FormControl>
                  <Input {...field} disabled={!isEditing} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="aadhaarNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Aadhaar Number</FormLabel>
                <FormControl>
                  <Input {...field} disabled={!isEditing} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="uanNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>UAN Number</FormLabel>
                <FormControl>
                  <Input {...field} disabled={!isEditing} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="pfNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>PF Number</FormLabel>
                <FormControl>
                  <Input {...field} disabled={!isEditing} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="esiNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ESI Number</FormLabel>
                <FormControl>
                  <Input {...field} disabled={!isEditing} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="taxId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tax ID</FormLabel>
                <FormControl>
                  <Input {...field} disabled={!isEditing} />
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
