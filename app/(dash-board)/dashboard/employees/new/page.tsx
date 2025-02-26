'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Loader } from 'lucide-react';
import * as z from 'zod';
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
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { createEmployee } from '@/actions/employees';
import { toast } from '@mosespace/toast';

// Keep your existing imports...

const employeeSchema = z
  .object({
    // Personal Information
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(10, 'Phone number must be at least 10 characters'),
    address: z.string().min(1, 'Address is required'),
    dateOfBirth: z.string().min(1, 'Date of birth is required'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character',
      ),
    confirmPassword: z.string(),
    notes: z.string().optional(),

    // Keep your existing schema fields...
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type EmployeeSchemaType = z.infer<typeof employeeSchema>;

// Keep your existing type definition...

export default function NewEmployeePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<EmployeeSchemaType>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
      dateOfBirth: '',
      password: '',
      confirmPassword: '',
      notes: '',
    },
  });

  async function onSubmit(values: EmployeeSchemaType) {
    try {
      setIsLoading(true);
      // Simulate an API call
      const response = await createEmployee(values as any);

      if (response.status === 201) {
        toast.success('Success', `${response.message}`);
        router.push(`/dashboard/employees/${response?.data?.id}`);
      } else {
        toast.error('Error', `${response.message}`);
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col pt-12 max-w-5xl w-full mx-auto min-h-screen">
      <div className="flex items-center justify-between space-x-2">
        <Button variant="ghost" onClick={() => router.back()}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-2xl font-semibold">New Employee</h1>
        <div>
          <Button
            type="submit"
            onClick={form.handleSubmit(onSubmit)}
            disabled={isLoading}
          >
            {isLoading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
            Create Employee
          </Button>
        </div>
      </div>

      <div className="container py-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Tabs defaultValue="personal" className="w-full">
              <TabsList>
                <TabsTrigger value="personal">Personal Information</TabsTrigger>
              </TabsList>

              <TabsContent value="personal">
                <Card>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="johndoe@example.com"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone</FormLabel>
                            <FormControl>
                              <Input placeholder="123-456-7890" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                              <Input placeholder="123 Main St" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="dateOfBirth"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date of Birth</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormDescription>
                              Must be at least 8 characters and include
                              uppercase, lowercase, number and special character
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Keep your existing fields... */}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Keep your existing tab contents... */}
            </Tabs>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any notes about the employee"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Additional information about the employee.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>
    </div>
  );
}
