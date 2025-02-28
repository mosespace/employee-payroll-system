'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import {
  BadgeCheck,
  AlertCircle,
  TrendingUp,
  DollarSign,
  Calendar,
} from 'lucide-react';
import { motion } from 'framer-motion';

// This would come from your API in a real app
const mockStats = {
  currentMonth: {
    paid: true,
    amount: 6500,
    date: '2024-02-15',
    status: 'Paid',
  },
  yearToDate: {
    total: 78000,
    average: 6500,
    increase: 5.2,
  },
  nextPayment: {
    estimated: '2024-03-15',
    amount: 6500,
  },
};

interface PaymentStatsProps {
  userId: string;
}

export function PaymentStats({ userId }: PaymentStatsProps) {
  const daysUntilNextPayment = () => {
    const today = new Date();
    const nextPayment = new Date(mockStats.nextPayment.estimated);
    const diffTime = Math.abs(nextPayment.getTime() - today.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const monthProgress = () => {
    const today = new Date();
    const totalDays = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0,
    ).getDate();
    const currentDay = today.getDate();
    return (currentDay / totalDays) * 100;
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {/* Current Month Status */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Current Month
          </CardTitle>
        </CardHeader>
        <CardContent>
          {mockStats.currentMonth.paid ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg border bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900 p-4"
            >
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                  <BadgeCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="font-medium">Payment Received</p>
                  <p className="text-sm text-muted-foreground">
                    ${mockStats.currentMonth.amount.toLocaleString()} •{' '}
                    {mockStats.currentMonth.date}
                  </p>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg border bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-900 p-4"
            >
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
                  <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <p className="font-medium">Payment Pending</p>
                  <p className="text-sm text-muted-foreground">
                    Expected on {mockStats.nextPayment.estimated}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Month Progress</span>
              <span className="font-medium">
                {Math.round(monthProgress())}%
              </span>
            </div>
            <Progress value={monthProgress()} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Year to Date */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Year to Date
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                ${mockStats.yearToDate.total.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Total earnings</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <p className="text-sm font-medium">
                ${mockStats.yearToDate.average.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Monthly average</p>
            </div>
            <div>
              <p className="text-sm font-medium text-emerald-600">
                +{mockStats.yearToDate.increase}%
              </p>
              <p className="text-sm text-muted-foreground">From last year</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Payment */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Next Payment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {daysUntilNextPayment()} days
              </p>
              <p className="text-sm text-muted-foreground">
                Until next payment
              </p>
            </div>
          </div>

          <Alert>
            <DollarSign className="h-4 w-4" />
            <AlertTitle>Estimated Amount</AlertTitle>
            <AlertDescription>
              ${mockStats.nextPayment.amount.toLocaleString()}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
