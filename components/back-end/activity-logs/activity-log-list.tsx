'use client';

import type React from 'react';

import {
  ArrowDownIcon,
  ArrowUpIcon,
  CalendarIcon,
  ChevronDownIcon,
  FilterIcon,
  SearchIcon,
} from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { ActivityLog } from '@prisma/client';
import { ActivityLogItem } from './activity-log-item';

interface ActivityLogListProps {
  getLogsAction: (
    page?: number,
    limit?: number,
    filter?: string,
  ) => Promise<{
    logs: ActivityLog[];
    totalPages: number;
    currentPage: number;
  }>;
}

export function ActivityLogList({ getLogsAction }: ActivityLogListProps) {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const fetchLogs = async (page = 1, filter = '') => {
    setLoading(true);
    try {
      const result = await getLogsAction(page, 10, filter);
      setLogs(result.logs);
      setTotalPages(result.totalPages);
      setCurrentPage(result.currentPage);
    } catch (error) {
      console.error('Failed to fetch logs:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useState(() => {
    fetchLogs();
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLogs(1, filter);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchLogs(page, filter);
  };

  const handleSort = () => {
    const newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    setSortDirection(newDirection);

    // Sort logs locally
    const sortedLogs = [...logs].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return newDirection === 'asc' ? dateA - dateB : dateB - dateA;
    });

    setLogs(sortedLogs);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <CardTitle>System Activity</CardTitle>
          <div className="flex flex-col sm:flex-row gap-2">
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative">
                <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search logs..."
                  className="pl-8 w-full md:w-[200px] lg:w-[300px]"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                />
              </div>
              <Button type="submit" variant="secondary" size="icon">
                <FilterIcon className="h-4 w-4" />
                <span className="sr-only">Filter</span>
              </Button>
            </form>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  Filter by date
                  <ChevronDownIcon className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Today</DropdownMenuItem>
                <DropdownMenuItem>Last 7 days</DropdownMenuItem>
                <DropdownMenuItem>Last 30 days</DropdownMenuItem>
                <DropdownMenuItem>This month</DropdownMenuItem>
                <DropdownMenuItem>Custom range</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <div className="grid grid-cols-12 border-b px-4 py-3 text-sm font-medium text-muted-foreground">
            <div className="col-span-5 md:col-span-3 flex items-center">
              <Button
                variant="ghost"
                size="sm"
                className="gap-1 p-0 font-medium"
                onClick={handleSort}
              >
                Timestamp
                {sortDirection === 'asc' ? (
                  <ArrowUpIcon className="h-4 w-4" />
                ) : (
                  <ArrowDownIcon className="h-4 w-4" />
                )}
              </Button>
            </div>
            <div className="col-span-3 hidden md:flex items-center">User</div>
            <div className="col-span-4 md:col-span-3 flex items-center">
              Action
            </div>
            <div className="col-span-3 hidden md:flex items-center">
              Description
            </div>
          </div>

          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="grid grid-cols-12 px-4 py-3 border-b">
                <div className="col-span-5 md:col-span-3">
                  <Skeleton className="h-5 w-32" />
                </div>
                <div className="col-span-3 hidden md:block">
                  <Skeleton className="h-5 w-24" />
                </div>
                <div className="col-span-4 md:col-span-3">
                  <Skeleton className="h-5 w-20" />
                </div>
                <div className="col-span-3 hidden md:block">
                  <Skeleton className="h-5 w-40" />
                </div>
              </div>
            ))
          ) : logs.length === 0 ? (
            <div className="px-4 py-8 text-center text-muted-foreground">
              No activity logs found
            </div>
          ) : (
            logs.map((log) => <ActivityLogItem key={log.id} log={log} />)
          )}
        </div>

        <div className="mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) handlePageChange(currentPage - 1);
                  }}
                  className={
                    currentPage <= 1 ? 'pointer-events-none opacity-50' : ''
                  }
                />
              </PaginationItem>

              {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                const page = i + 1;
                return (
                  <PaginationItem key={page}>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(page);
                      }}
                      isActive={page === currentPage}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

              {totalPages > 5 && (
                <>
                  <PaginationItem>
                    <PaginationLink
                      href="#"
                      onClick={(e) => e.preventDefault()}
                    >
                      ...
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(totalPages);
                      }}
                      isActive={totalPages === currentPage}
                    >
                      {totalPages}
                    </PaginationLink>
                  </PaginationItem>
                </>
              )}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages)
                      handlePageChange(currentPage + 1);
                  }}
                  className={
                    currentPage >= totalPages
                      ? 'pointer-events-none opacity-50'
                      : ''
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </CardContent>
    </Card>
  );
}
