'use client';

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import * as React from 'react';
import { useState, useMemo } from 'react';

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal } from 'lucide-react';

import DateRangeFilter from './data-table-date-range';
import DateFilters from './data-table-dates';
import { DataTablePagination } from './data-table-pagination';
import SearchBar from './data-table-search';
import { DataTableViewOptions } from './data-table-view';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  initialPageSize?: number;
  placeholder?: string;
  searchKeys?: string[];
}

export default function DataTable<TData, TValue>({
  columns,
  data,
  searchKeys,
  placeholder,
  initialPageSize = 10,
}: DataTableProps<TData, TValue>) {
  // Table state
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);

  // Filtering state
  const [filteredData, setFilteredData] = useState<TData[]>(data);
  const [searchActive, setSearchActive] = useState(false);

  // Memoize the final data to prevent unnecessary re-renders
  const tableData = useMemo(
    () => (searchActive ? filteredData : data),
    [searchActive, filteredData, data],
  );

  const table = useReactTable({
    data: tableData,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    initialState: {
      pagination: {
        pageSize: initialPageSize,
      },
    },
  });

  // Handler for filter updates
  const handleFilterUpdate = (newData: TData[]) => {
    setFilteredData(newData);
    setSearchActive(true);
    // Reset to first page when filter changes
    table.setPageIndex(0);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center gap-8">
        <div className="flex-1 w-full">
          {searchKeys && searchKeys.length > 0 ? ( // With specific search keys
            <SearchBar
              data={data}
              onSearch={handleFilterUpdate}
              setIsSearch={setSearchActive}
              placeholder="Search services..."
              searchKeys={searchKeys}
            />
          ) : (
            // Basic usage
            <SearchBar
              data={data}
              onSearch={handleFilterUpdate}
              setIsSearch={setSearchActive}
              placeholder={placeholder}
            />
          )}
        </div>

        <div className="flex items-center gap-2">
          <DateRangeFilter
            data={data}
            onFilter={handleFilterUpdate}
            setIsSearch={setSearchActive}
          />
          <DateFilters
            data={data}
            onFilter={handleFilterUpdate}
            setIsSearch={setSearchActive}
          />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-10 gap-1">
                <SlidersHorizontal className="size-4 mr-2" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Filter
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={!columnFilters.some((f) => f.id === 'status')}
                onCheckedChange={() => {
                  setColumnFilters((prev) =>
                    prev.filter((f) => f.id !== 'status'),
                  );
                }}
              >
                All
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={columnFilters.some(
                  (f) => f.id === 'status' && f.value === 'ACTIVE',
                )}
                onCheckedChange={() => {
                  setColumnFilters([{ id: 'status', value: 'ACTIVE' }]);
                }}
              >
                Active
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={columnFilters.some(
                  (f) => f.id === 'status' && f.value === 'INACTIVE',
                )}
                onCheckedChange={() => {
                  setColumnFilters([{ id: 'status', value: 'INACTIVE' }]);
                }}
              >
                Inactive
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DataTableViewOptions table={table} />
        </div>
      </div>

      <div className="rounded-md px-8s pb-3 border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} colSpan={header.colSpan}>
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
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination table={table} />
    </div>
  );
}
