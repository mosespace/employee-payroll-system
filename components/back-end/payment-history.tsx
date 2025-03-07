'use client';

import {
  downloadPaymentStatement,
  getPaymentHistory,
} from '@/actions/payments';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from '@mosespace/toast';
import { Download, Eye, Loader2, Search } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

interface PaymentHistoryProps {
  userId: string;
}

export function PaymentHistory({ userId }: PaymentHistoryProps) {
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('2024');
  const [payments, setPayments] = useState<any[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 1,
    current: 1,
    limit: 10,
  });

  const years = ['2024', '2023', '2022'];
  const months = [
    { value: 'all', label: 'All Months' },
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getPaymentHistory({
        userId,
        searchQuery,
        month: selectedMonth,
        year: selectedYear,
      });

      // console.log('Response ✅:', response);

      if (response.success) {
        setPayments(response.data as any);
        setPagination(response.pagination as any);
      } else {
        toast.error(
          'Error',
          response.error || 'Failed to fetch payment history',
        );
      }
    } catch (error) {
      console.log('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }, [userId, searchQuery, selectedMonth, selectedYear, toast]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const response = await downloadPaymentStatement(
        userId,
        selectedYear,
        selectedMonth,
      );
      if (response.success) {
        // In a real app, you would handle the file download here
        toast.success('Success', 'Statement downloaded successfully');
      } else {
        toast.error('Error', response.error || 'Failed to download statement');
      }
    } catch (error) {
      toast.error('Error', 'An unexpected error occurred');
    } finally {
      setDownloading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-emerald-700 dark:bg-emerald-900';
      case 'paid':
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900';
      case 'failed':
        return 'bg-red-100 text-red-700 dark:bg-red-900';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>Payment History</CardTitle>
            <CardDescription>
              View all your past payments and transactions
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            disabled={downloading}
          >
            {downloading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Download className="h-4 w-4 mr-2" />
            )}
            Download Statement
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search payments..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                {years.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Month" />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month.value} value={month.value}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-24">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                    </TableCell>
                  </TableRow>
                ) : payments.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center h-24 text-muted-foreground"
                    >
                      No payments found
                    </TableCell>
                  </TableRow>
                ) : (
                  payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>
                        {new Date(payment.createdAt).toLocaleDateString(
                          'en-US',
                          {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          },
                        )}
                      </TableCell>
                      <TableCell className="font-medium">
                        {payment.paymentMethod}
                      </TableCell>
                      <TableCell>{payment.type}</TableCell>
                      <TableCell className="font-medium">
                        UGX {payment.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={getStatusColor(payment.status)}
                        >
                          {payment.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            (window.location.href = `/dashboard/payments/${payment.id}`)
                          }
                        >
                          <Eye className="size-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
