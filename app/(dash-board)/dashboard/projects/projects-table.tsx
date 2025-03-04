'use client';

import * as React from 'react';
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { format } from 'date-fns';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';
import type { ProjectWithDetails } from '@/actions/projects';

export const columns: ColumnDef<ProjectWithDetails>[] = [
  {
    accessorKey: 'name',
    header: 'Project Name',
    cell: ({ row }) => (
      <div className="font-medium">
        <Link
          href={`/dashboard/projects/${row.original.id}`}
          className="hover:underline"
        >
          {row.getValue('name')}
        </Link>
      </div>
    ),
  },
  {
    accessorKey: 'client',
    header: 'Client',
  },
  {
    accessorKey: 'startDate',
    header: 'Start Date',
    cell: ({ row }) =>
      format(new Date(row.getValue('startDate')), 'MMM d, yyyy'),
  },
  {
    accessorKey: 'endDate',
    header: 'End Date',
    cell: ({ row }) => {
      const endDate = row.getValue('endDate');
      return endDate
        ? format(new Date(endDate as string), 'MMM d, yyyy')
        : 'Ongoing';
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      return (
        <Badge
          variant="outline"
          className={
            status === 'ONGOING'
              ? 'bg-blue-50 text-blue-600 border-blue-200'
              : status === 'COMPLETED'
                ? 'bg-green-50 text-green-600 border-green-200'
                : 'bg-red-50 text-red-600 border-red-200'
          }
        >
          {status === 'ONGOING'
            ? 'Active'
            : status === 'COMPLETED'
              ? 'Completed'
              : 'Cancelled'}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'budget',
    header: 'Budget',
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue('budget'));
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount);
    },
  },
  {
    accessorKey: 'progress',
    header: 'Progress',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      const progress =
        status === 'COMPLETED' ? 100 : (row.getValue('progress') as number);

      return (
        <div className="w-full flex items-center gap-2">
          <Progress value={progress} className="h-2" />
          <span className="text-xs text-muted-foreground w-9">{progress}%</span>
        </div>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const project = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link
                href={`/dashboard/projects/${project.id}`}
                className="cursor-pointer"
              >
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href={`/dashboard/projects/${project.id}`}
                className="cursor-pointer"
              >
                View Details
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-600 focus:text-red-600">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export function ProjectsTable({
  projects,
}: {
  projects: ProjectWithDetails[];
}) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [statusFilter, setStatusFilter] = React.useState<string>('all');

  const filteredProjects = React.useMemo(() => {
    if (statusFilter === 'all') return projects;
    return projects.filter(
      (project) => project.status === statusFilter.toUpperCase(),
    );
  }, [projects, statusFilter]);

  const table = useReactTable({
    data: filteredProjects,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Input
          placeholder="Filter projects..."
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('name')?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Projects</SelectItem>
            <SelectItem value="ongoing">Active</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No projects found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          Showing {table.getRowModel().rows.length} of {projects.length}{' '}
          projects
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
