'use client';

import type React from 'react';

import { useState, useEffect, useCallback } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronLeft, ChevronRight, Search, Calendar } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getAttendanceRecords } from '@/actions/attendance';
import { calculateHoursDifference, formatTime } from '@/utils/formatTime';

interface AttendanceRecord {
  id: string;
  employeeId: string;
  checkInTime: Date;
  checkOutTime: Date | null;
  totalHours: number | null;
  date: Date;
  employee: {
    id: string;
    name: string;
    email: string;
    image: string | null;
    employeeId: string | null;
  };
}

interface AttendanceTableProps {
  initialDate?: Date;
}

export function AttendanceTable({
  initialDate = new Date(),
}: AttendanceTableProps) {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchAttendanceRecords = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getAttendanceRecords({
        date: selectedDate,
        searchQuery: searchQuery || undefined,
        page,
        limit: 10,
      });

      if (response?.success) {
        setRecords(response?.data ?? []);
        setTotalPages(response?.pagination?.pages ?? 1);
      }
    } catch (error) {
      console.error('Error fetching attendance records:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedDate, searchQuery, page]);

  useEffect(() => {
    fetchAttendanceRecords();
  }, [fetchAttendanceRecords]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      setSelectedDate(new Date(e.target.value));
      setPage(1);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchAttendanceRecords();
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <form onSubmit={handleSearch} className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by name..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <Input
            type="date"
            value={selectedDate.toISOString().split('T')[0]}
            onChange={handleDateChange}
            className="w-full sm:w-auto"
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member Name</TableHead>
              <TableHead>Clock In</TableHead>
              <TableHead>Clock Out</TableHead>
              <TableHead>Time Worked</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  Loading...
                </TableCell>
              </TableRow>
            ) : records.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  No attendance records found
                </TableCell>
              </TableRow>
            ) : (
              records.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={record.employee.image || undefined}
                          alt={record.employee.name}
                        />
                        <AvatarFallback>
                          {getInitials(record.employee.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">
                          {record.employee.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {record.employee.employeeId || record.employee.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{formatTime(record.checkInTime)}</TableCell>
                  <TableCell>{formatTime(record.checkOutTime)}</TableCell>
                  <TableCell>
                    {record.totalHours
                      ? `${record.totalHours.toFixed(2)} h`
                      : record.checkOutTime
                        ? calculateHoursDifference(
                            record.checkInTime,
                            record.checkOutTime,
                          )
                        : '--'}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Page {page} of {totalPages}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreviousPage}
            disabled={page <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={page >= totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
