'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CompensationDetails, PaymentRecord, User } from '@prisma/client';
import { format } from 'date-fns';
import { Building2, Calendar, DollarSign, User2 } from 'lucide-react';
import { useState } from 'react';

interface PayrollDetailsProps {
  payroll: PaymentRecord & {
    employee: User & { compensation: CompensationDetails };
  } & { createdBy: User }; // Replace with proper type
}

export function PayrollDetails({ payroll }: PayrollDetailsProps) {
  const [activeTab, setActiveTab] = useState('overview');
  // const payroll = payroll['0'];

  // console.log('Payroll:', payroll);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
      case 'failed':
        return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const formatCurrency = (amount: number | null) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount as number);
  };

  // console.log('PayrollData:', payroll);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="text-2xl">Payment Details</CardTitle>
            <CardDescription>Payment reference: {payroll.id}</CardDescription>
          </div>
          <Badge
            variant="secondary"
            className={getStatusColor(payroll?.status)}
          >
            {payroll?.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Amount
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatCurrency(payroll.amount)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {payroll.paymentMethod?.replace('_', ' ')}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Pay Period
                  </CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {format(new Date(payroll.payPeriodStart), 'MMM yyyy')}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(payroll.payPeriodStart), 'MMM d')} -{' '}
                    {format(new Date(payroll.payPeriodEnd), 'MMM d, yyyy')}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Department
                  </CardTitle>
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Engineering</div>
                  <p className="text-xs text-muted-foreground">
                    Software Development
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Employee
                  </CardTitle>
                  <User2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={payroll.employee?.image || '/placeholder.scg'}
                      />
                      <AvatarFallback>
                        {payroll.employee?.name
                          .split(' ')
                          .map((n: string) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {payroll.employee?.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {payroll.employee?.position}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="breakdown">
            <div className="space-y-6">
              {/* Earnings */}
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-4">
                  Earnings
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Base Salary</span>
                    <span className="font-medium">
                      {formatCurrency(payroll.netAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Housing Allowance</span>
                    <span className="font-medium">
                      {formatCurrency(
                        payroll.employee.compensation.housingAllowance,
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Transport Allowance</span>
                    <span className="font-medium">
                      {formatCurrency(
                        payroll.employee?.compensation?.transportAllowance,
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Meal Allowance</span>
                    <span className="font-medium">
                      {formatCurrency(
                        payroll.employee?.compensation?.mealAllowance,
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Other Allowances</span>
                    <span className="font-medium">
                      {formatCurrency(
                        payroll.employee?.compensation?.otherAllowances,
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Deductions */}
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-4">
                  Deductions
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Tax</span>
                    <span className="font-medium text-red-600">
                      -{formatCurrency(payroll.taxDeductions)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Insurance</span>
                    <span className="font-medium text-red-600">
                      -
                      {formatCurrency(
                        payroll.employee?.compensation?.insuranceDeduction,
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Pension</span>
                    <span className="font-medium text-red-600">
                      -
                      {formatCurrency(
                        payroll.employee?.compensation?.pensionDeduction,
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Other Deductions</span>
                    <span className="font-medium text-red-600">
                      -
                      {formatCurrency(
                        payroll.employee?.compensation?.otherDeduction,
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Net Pay */}
              <div className="flex justify-between items-center pt-2">
                <span className="font-medium">Net Pay</span>
                <span className="text-2xl font-bold">
                  {formatCurrency(payroll.amount)}
                </span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="details">
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Payment Information
                  </h4>
                  <div className="rounded-lg border p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Method
                      </span>
                      <span className="text-sm font-medium">
                        {payroll.paymentMethod.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Reference
                      </span>
                      <span className="text-sm font-medium">
                        {payroll.reference}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Date
                      </span>
                      <span className="text-sm font-medium">
                        {format(new Date(payroll.createdAt), 'PPP')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Created By
                  </h4>
                  <div className="rounded-lg border p-4 space-y-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback>
                          {payroll.createdBy.name
                            .split(' ')
                            .map((n: string) => n[0])
                            .join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">
                          {payroll.createdBy.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {payroll.createdBy.role}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Created At
                      </span>
                      <span className="text-xs font-medium">
                        {format(new Date(payroll.createdAt), 'PPP p')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
