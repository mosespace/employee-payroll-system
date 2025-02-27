'use client';

import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

interface IProps {
  isEditing?: boolean;
  id?: string;
  activeTab: string;

  data: {
    id: string;
    label: string;
    Component: React.FC<any>;
  }[];
}
export default function DynamicTabs({
  isEditing,
  activeTab,
  id,
  data,
}: IProps) {
  const [isActive, setIsActive] = useState(activeTab);

  return (
    <Tabs
      defaultValue="official"
      value={isActive}
      onValueChange={setIsActive}
      className="w-full"
    >
      <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
        {data.map((tab) => (
          <TabsTrigger
            key={tab.id}
            value={tab.id}
            className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary"
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      <div className="mt-6">
        {data.map((tab) => (
          <TabsContent key={tab.id} value={tab.id}>
            <tab.Component isEditing={isEditing} data={tab} />
          </TabsContent>
        ))}
      </div>
    </Tabs>
  );
}
