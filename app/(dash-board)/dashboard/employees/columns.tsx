'use client';

import ActionColumn from '@/components/back-end/data-table/data-table-columns/action-column';
import { StatusCell } from '@/components/back-end/data-table/data-table-columns/status-cell';
import { User } from '@prisma/client';
import { ColumnDef } from '@tanstack/react-table';

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'image',
    header: 'Image',
    cell: ({ row }) => {
      const user = row.original;
      return (
        <span className="px-4 py-2 line-clamp-3">
          <img
            className="w-12 h-12 rounded-lg"
            src={user.image || '/placeholder.svg'}
            alt={user.name}
          />
        </span>
      );
    },
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => {
      const user = row.original;

      return (
        <span className="px-4 py-2 line-clamp-3">
          <span className="font-semibold">UGX {user.email}</span>
        </span>
      );
    },
  },

  {
    accessorKey: 'role',
    header: 'Role',

    // header: ({ column }) => (
    //   // <SortableColumn column={column} title="Bus Status" />
    // ),
    cell: ({ row }) => {
      const employee = row.original;
      const statusStyles = {
        EMPLOYEE: 'bg-orange-600 text-white',
        MANAGER: 'bg-red-600 text-white',
        ADMIN: 'bg-teal-600 text-white',
      };

      const options = ['EMPLOYEE', 'MANAGER', 'ADMIN'];

      return (
        <StatusCell
          statusStyles={statusStyles}
          id={employee.id}
          model="employee"
          initialStatus={employee.role}
          options={options}
        />
      );
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const employee = row.original;
      return (
        <ActionColumn
          row={row as any}
          model="employee"
          editEndpoint={`dashboard/employee/${employee.id}`}
          id={employee.id}
        />
      );
    },
  },
];
