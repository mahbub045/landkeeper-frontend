'use client';

import { Building2, Calculator, FileText, Landmark, LineChart, ShieldCheck } from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────

interface Report {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

// ── Static Data ───────────────────────────────────────────────────────────────

const reports: Report[] = [
  {
    id: 1,
    title: 'Portfolio Summary',
    description: 'Complete overview of all properties',
    icon: <Building2 className='size-10 text-blue-600' />,
  },
  {
    id: 2,
    title: 'Income Report',
    description: 'Rental income analysis',
    icon: <LineChart className='size-10 text-emerald-600' />,
  },
  {
    id: 3,
    title: 'Expense Report',
    description: 'Track all property expenses',
    icon: <FileText className='size-10 text-red-500' />,
  },
  {
    id: 4,
    title: 'Tax Preparation',
    description: 'HMRC-ready tax summary',
    icon: <Calculator className='size-10 text-amber-500' />,
  },
  {
    id: 5,
    title: 'Compliance Report',
    description: 'Certificate status overview',
    icon: <ShieldCheck className='size-10 text-cyan-500' />,
  },
  {
    id: 6,
    title: 'Mortgage Summary',
    description: 'All mortgage details',
    icon: <Landmark className='size-10 text-purple-500' />,
  },
];

// ── Sub-components ────────────────────────────────────────────────────────────

function ReportCard({ report }: { report: Report }) {
  return (
    <button className='flex flex-col items-center justify-center text-center gap-4 bg-white dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 rounded-2xl p-8 shadow-sm hover:shadow-md hover:border-gray-200 dark:hover:border-gray-600 transition-all cursor-pointer w-full'>
      {report.icon}
      <div>
        <p className='text-base font-bold text-gray-900 dark:text-white'>{report.title}</p>
        <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>{report.description}</p>
      </div>
    </button>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function ReportsPage() {
  return (
    <div className='space-y-6'>
      {/* Header */}
      <div>
        <h1 className='text-2xl font-bold tracking-tight text-gray-900 dark:text-white'>Reports</h1>
        <p className='text-sm text-gray-500 dark:text-gray-400'>Generate and export portfolio reports</p>
      </div>

      {/* Grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4'>
        {reports.map((report) => (
          <ReportCard key={report.id} report={report} />
        ))}
      </div>
    </div>
  );
}