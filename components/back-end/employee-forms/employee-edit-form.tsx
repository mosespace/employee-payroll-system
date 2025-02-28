'use client';

import DynamicTabs from '@/components/back-end/dynamic-tabs/dynamic-tabs';
import { Button } from '@/components/ui/button';
import { User } from '@prisma/client';
import { Edit2, Trash2, X } from 'lucide-react';
import { useState } from 'react';

import { BankDetails } from './bank-details';
import { CompensationDetails } from './compensation-details';
import { GeneralDetails } from './general-details';
import { SeparationDetails } from './separation-details';
import { StatutoryDetails } from './statutory-details';
import { Option } from 'react-tailwindcss-select/dist/components/type';
import { OfficialDetails } from '@/app/(dash-board)/dashboard/employees/[id]/official-details';
export default function EmployeeEditForm({
  employee,
  managersAndAdmins,
}: {
  employee: User | null | undefined;
  managersAndAdmins: Option | null;
}) {
  const [isEditing, setIsEditing] = useState(false);

  // Tab configuration array
  const tabsConfig = [
    {
      id: 'official',
      label: 'Official',
      Component: () => (
        <OfficialDetails
          isEditing={isEditing}
          managersAndAdmins={managersAndAdmins as any}
          data={employee}
        />
      ),
    },
    {
      id: 'general',
      label: 'General',
      Component: () => <GeneralDetails isEditing={isEditing} data={employee} />,
    },
    {
      id: 'bank',
      label: 'Bank A/C',
      Component: () => (
        <BankDetails isEditing={isEditing} data={employee as any} />
      ),
    },
    {
      id: 'statutory',
      label: 'Statutory',
      Component: () => (
        <StatutoryDetails isEditing={isEditing} data={employee as any} />
      ),
    },
    {
      id: 'compensation',
      label: 'Compensation',
      Component: () => (
        <CompensationDetails isEditing={isEditing} data={employee as any} />
      ),
    },
    {
      id: 'leave',
      label: 'Leave',
      Component: () => (
        <SeparationDetails isEditing={isEditing} data={employee as any} />
      ),
    },
  ];

  return (
    <div className="flex max-w-5xl mx-auto flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-medium">Employee Details</h1>
          </div>
          <div className="flex items-center gap-2">
            {!isEditing && (
              <Button
                variant="ghost"
                size="sm"
                className="gap-2"
                onClick={() => setIsEditing(!isEditing)}
              >
                <Edit2 className="h-4 w-4" />
                Edit
              </Button>
            )}
            {isEditing && (
              <Button
                className="bg-purple-500 gap-2 hover:bg-purple-700 hover:text-white"
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
              >
                Don't edit
                <X className="size-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-red-500 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
      </header>

      <div className="container py-6">
        <div className="grid gap-6">
          <div className="flex items-center justify-between">
            <div className="grid gap-1">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-semibold">{employee?.name}</h2>
                <span className="text-sm text-muted-foreground">
                  ({employee?.employeeId})
                </span>
              </div>
              <p className="text-muted-foreground">
                {employee?.designation} • {employee?.department}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground">
                Date of Joining:{' '}
                <span className="font-medium">28 April 2021</span>
              </div>
              <div className="text-sm text-muted-foreground">
                Location: <span className="font-medium">New York</span>
              </div>
            </div>
          </div>

          <DynamicTabs data={tabsConfig} activeTab="official" />
        </div>
      </div>
    </div>
  );
}
