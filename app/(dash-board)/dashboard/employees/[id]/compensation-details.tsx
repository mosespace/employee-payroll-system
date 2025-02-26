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

const formSchema = z.object({
  baseSalary: z.number().min(0, 'Base salary must be a positive number'),
  paymentFrequency: z.enum(['WEEKLY', 'BIWEEKLY', 'MONTHLY', 'YEARLY']),
  overtimeRate: z.number().min(0, 'Overtime rate must be a positive number'),
  bonusEligibility: z.boolean(),
  allowances: z.object({
    housing: z.number().optional(),
    transport: z.number().optional(),
    meal: z.number().optional(),
    other: z.number().optional(),
  }),
  deductions: z.object({
    tax: z.number().optional(),
    insurance: z.number().optional(),
    pension: z.number().optional(),
    other: z.number().optional(),
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface CompensationDetailsProps {
  isEditing: boolean;
  employeeId: string;
}

export function CompensationDetails({
  isEditing,
  employeeId,
}: CompensationDetailsProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      baseSalary: 0,
      overtimeRate: 0,
      bonusEligibility: false,
      allowances: {
        housing: 0,
        transport: 0,
        meal: 0,
        other: 0,
      },
      deductions: {
        tax: 0,
        insurance: 0,
        pension: 0,
        other: 0,
      },
    },
  });

  async function onSubmit(data: FormValues) {
    try {
      const response = await fetch(`/api/employees/${employeeId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ compensation: data }),
      });
      if (!response.ok) throw new Error('Failed to update');
    } catch (error) {
      console.error('Error updating compensation details:', error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-6">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="baseSalary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Base Salary</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) =>
                        field.onChange(Number.parseFloat(e.target.value))
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
              name="paymentFrequency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Frequency</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={!isEditing}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="WEEKLY">Weekly</SelectItem>
                      <SelectItem value="BIWEEKLY">Bi-weekly</SelectItem>
                      <SelectItem value="MONTHLY">Monthly</SelectItem>
                      <SelectItem value="YEARLY">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-4">
            <h3 className="text-lg font-medium">Allowances</h3>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="allowances.housing"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Housing Allowance</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(Number.parseFloat(e.target.value))
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
                name="allowances.transport"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Transport Allowance</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(Number.parseFloat(e.target.value))
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
                name="allowances.meal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meal Allowance</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(Number.parseFloat(e.target.value))
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
                name="allowances.other"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Other Allowances</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(Number.parseFloat(e.target.value))
                        }
                        disabled={!isEditing}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="grid gap-4">
            <h3 className="text-lg font-medium">Deductions</h3>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="deductions.tax"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tax Deduction</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(Number.parseFloat(e.target.value))
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
                name="deductions.insurance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Insurance Deduction</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(Number.parseFloat(e.target.value))
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
                name="deductions.pension"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pension Deduction</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(Number.parseFloat(e.target.value))
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
                name="deductions.other"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Other Deductions</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(Number.parseFloat(e.target.value))
                        }
                        disabled={!isEditing}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
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
