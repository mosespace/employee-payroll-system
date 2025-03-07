import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export async function generatePDF(payroll: any) {
  // Create a new PDF document
  const doc = new jsPDF();

  // Add company logo or header
  doc.setFontSize(20);
  doc.text('Payroll Statement', 105, 15, { align: 'center' });

  // Add payroll information
  doc.setFontSize(12);
  doc.text(`Reference: ${payroll.id}`, 20, 30);
  doc.text(
    `Date: ${new Date(payroll.payment.date).toLocaleDateString()}`,
    20,
    40,
  );

  // Add employee information
  doc.text('Employee Information', 20, 60);
  doc.setFontSize(10);
  doc.text(`Name: ${payroll.employee.name}`, 20, 70);
  doc.text(`Position: ${payroll.employee.position}`, 20, 80);

  // Add payment breakdown table
  const tableData = [
    ['Description', 'Amount'],
    ['Base Salary', `$${payroll.breakdown.baseSalary.toLocaleString()}`],
    [
      'Housing Allowance',
      `$${payroll.breakdown.allowances.housing.toLocaleString()}`,
    ],
    [
      'Transport Allowance',
      `$${payroll.breakdown.allowances.transport.toLocaleString()}`,
    ],
    [
      'Meal Allowance',
      `$${payroll.breakdown.allowances.meal.toLocaleString()}`,
    ],
    [
      'Other Allowances',
      `$${payroll.breakdown.allowances.other.toLocaleString()}`,
    ],
    [
      'Tax Deductions',
      `-$${payroll.breakdown.deductions.tax.toLocaleString()}`,
    ],
    [
      'Insurance Deductions',
      `-$${payroll.breakdown.deductions.insurance.toLocaleString()}`,
    ],
    [
      'Pension Deductions',
      `-$${payroll.breakdown.deductions.pension.toLocaleString()}`,
    ],
    [
      'Other Deductions',
      `-$${payroll.breakdown.deductions.other.toLocaleString()}`,
    ],
    ['Net Pay', `$${payroll.payment.amount.toLocaleString()}`],
  ];

  autoTable(doc, {
    startY: 100,
    head: [tableData[0]],
    body: tableData.slice(1),
    theme: 'grid',
    styles: {
      fontSize: 10,
      cellPadding: 5,
    },
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255,
    },
    footStyles: {
      fillColor: [41, 128, 185],
      textColor: 255,
    },
  });

  // Add footer
  const pageCount = doc.internal.pages.length - 1;
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(
      `Generated on ${new Date().toLocaleString()} - Page ${i} of ${pageCount}`,
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 10,
      { align: 'center' },
    );
  }

  // Save the PDF
  doc.save(`payroll-${payroll.id}.pdf`);
}
