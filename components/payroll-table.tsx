"use client"

import * as React from "react"
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
} from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { CalendarIcon, Filter } from "lucide-react"
import { format, subDays } from "date-fns"
import type { DateRange } from "react-day-picker"
import { Calendar } from "@/components/ui/calendar"

export type Payment = {
  id: string
  name: string
  salary: number
  overtime: number
  bonuses: number
  expenses: number
  training: number
  totalAddition: number
  totalPayroll: number
}

export const columns: ColumnDef<Payment>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    header: "Employee Status",
    columns: [
      {
        accessorKey: "id",
        header: "ID",
      },
      {
        accessorKey: "name",
        header: "Name",
      },
    ],
  },
  {
    header: "Earnings",
    columns: [
      {
        accessorKey: "salary",
        header: "Salary",
        cell: ({ row }) => {
          const amount = Number.parseFloat(row.getValue("salary"))
          const formatted = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(amount)
          return formatted
        },
      },
      {
        accessorKey: "overtime",
        header: "Overtime",
        cell: ({ row }) => {
          const amount = Number.parseFloat(row.getValue("overtime"))
          const formatted = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(amount)
          return formatted
        },
      },
    ],
  },
  {
    header: "Reimbursement",
    columns: [
      {
        accessorKey: "bonuses",
        header: "Bonuses",
        cell: ({ row }) => {
          const amount = Number.parseFloat(row.getValue("bonuses"))
          return amount
            ? new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(amount)
            : "-"
        },
      },
      {
        accessorKey: "expenses",
        header: "Expenses",
        cell: ({ row }) => {
          const amount = Number.parseFloat(row.getValue("expenses"))
          return amount
            ? new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(amount)
            : "-"
        },
      },
      {
        accessorKey: "training",
        header: "Training",
        cell: ({ row }) => {
          const amount = Number.parseFloat(row.getValue("training"))
          return amount
            ? new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(amount)
            : "-"
        },
      },
    ],
  },
  {
    header: "Addition",
    columns: [
      {
        accessorKey: "totalAddition",
        header: "Total Addition",
        cell: ({ row }) => {
          const amount = Number.parseFloat(row.getValue("totalAddition"))
          const formatted = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(amount)
          return formatted
        },
      },
    ],
  },
  {
    header: "Total",
    columns: [
      {
        accessorKey: "totalPayroll",
        header: "Person payroll",
        cell: ({ row }) => {
          const amount = Number.parseFloat(row.getValue("totalPayroll"))
          const formatted = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(amount)
          return formatted
        },
      },
    ],
  },
]

export function PayrollTable({ data }: { data: Payment[] }) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [editMode, setEditMode] = React.useState(false)
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: subDays(new Date(), 11),
    to: new Date(),
  })
  const [filterValue, setFilterValue] = React.useState<string>("all")

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  // Helper function to determine cell background color
  const getCellBackground = (cellId: string) => {
    if (cellId.includes("salary") || cellId.includes("overtime")) {
      return "bg-[#e3f2fd]/40"
    }
    if (cellId.includes("bonuses") || cellId.includes("expenses") || cellId.includes("training")) {
      return "bg-[#f3e5f5]/40"
    }
    if (cellId.includes("totalAddition")) {
      return "bg-[#fff3e0]/40"
    }
    return ""
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Input
          placeholder="Search for name or ID"
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
          className="max-w-sm"
        />
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn("justify-start text-left font-normal", !date && "text-muted-foreground")}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "LLL dd")} - {format(date.to, "LLL dd")}
                  </>
                ) : (
                  format(date.from, "LLL dd")
                )
              ) : (
                "Pick a date"
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
        <Select value={filterValue} onValueChange={setFilterValue}>
          <SelectTrigger className="w-[180px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filter by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="salary">Salary</SelectItem>
            <SelectItem value="overtime">Overtime</SelectItem>
            <SelectItem value="bonuses">Bonuses</SelectItem>
          </SelectContent>
        </Select>
        <Button variant={editMode ? "default" : "outline"} className="ml-auto" onClick={() => setEditMode(!editMode)}>
          Edit Mode
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      className={cn(
                        "h-12",
                        header.column.columnDef.header === "Earnings" && "bg-[#e3f2fd]",
                        header.column.columnDef.header === "Reimbursement" && "bg-[#f3e5f5]",
                        header.column.columnDef.header === "Addition" && "bg-[#fff3e0]",
                      )}
                    >
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, i) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={cn(
                    row.getIsSelected() && "bg-blue-50",
                    !row.getIsSelected() && i % 2 === 0 && "bg-gray-50/30",
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(getCellBackground(cell.column.id), row.getIsSelected() && "bg-opacity-50")}
                    >
                      {editMode && cell.column.id !== "select" ? (
                        <Input defaultValue={cell.getValue() as string} className="h-8 bg-white" />
                      ) : (
                        flexRender(cell.column.columnDef.cell, cell.getContext())
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {table.getFilteredSelectedRowModel().rows.length > 0 && (
            <>
              <span className="text-sm text-blue-600 font-medium">
                {table.getFilteredSelectedRowModel().rows.length} Employees Selected
              </span>
              <Button
                variant="link"
                className="text-sm text-blue-600"
                onClick={() => table.toggleAllRowsSelected(false)}
              >
                Unselect All
              </Button>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </div>
        {table.getFilteredSelectedRowModel().rows.length > 0 && (
          <div className="flex items-center gap-4">
            <div className="text-sm">
              Total Payroll:{" "}
              <span className="font-medium">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(
                  table.getFilteredSelectedRowModel().rows.reduce((total, row) => total + row.original.totalPayroll, 0),
                )}
              </span>
            </div>
            <Button>Send Payroll</Button>
          </div>
        )}
      </div>
    </div>
  )
}

