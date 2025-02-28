import CreatePayrollForm from '@/components/back-end/forms/create-payroll-form';
import React from 'react';

export default function page() {
  return (
    <div className="container max-w-4xl mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Create New Payroll</h1>
      <CreatePayrollForm />
    </div>
  );
}
