'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Landmark, Percent, CalendarDays, FileText, Calculator, Plus, TriangleAlert } from 'lucide-react';

// ── Types ────────────────────────────────────────────────────────────────────

interface Mortgage {
  id: number;
  property: string;
  lender: string;
  type: 'Fixed Rate' | 'Tracker' | 'Variable';
  renewalDue: boolean;
  interestRate: number;
  outstandingBalance: number;
  originalLoan: number;
  monthlyPayment: number;
  termRemainingMonths: number;
}

// ── Static Data ──────────────────────────────────────────────────────────────

const mortgages: Mortgage[] = [
  {
    id: 1,
    property: '14 Oak Street',
    lender: 'Halifax',
    type: 'Fixed Rate',
    renewalDue: true,
    interestRate: 3.2,
    outstandingBalance: 245000,
    originalLoan: 280000,
    monthlyPayment: 1250,
    termRemainingMonths: 0,
  },
  {
    id: 2,
    property: '42 Maple Avenue',
    lender: 'Nationwide',
    type: 'Tracker',
    renewalDue: false,
    interestRate: 4.1,
    outstandingBalance: 195000,
    originalLoan: 220000,
    monthlyPayment: 980,
    termRemainingMonths: 14,
  },
  {
    id: 3,
    property: '8 Pine Road',
    lender: 'Santander',
    type: 'Fixed Rate',
    renewalDue: true,
    interestRate: 2.9,
    outstandingBalance: 145000,
    originalLoan: 160000,
    monthlyPayment: 720,
    termRemainingMonths: 0,
  },
  {
    id: 4,
    property: '23 Elm Drive',
    lender: 'Barclays',
    type: 'Variable',
    renewalDue: false,
    interestRate: 4.5,
    outstandingBalance: 310000,
    originalLoan: 350000,
    monthlyPayment: 1650,
    termRemainingMonths: 30,
  },
];

// ── Derived summary stats ────────────────────────────────────────────────────

const totalDebt = mortgages.reduce((sum, m) => sum + m.outstandingBalance, 0);
const avgRate = mortgages.reduce((sum, m) => sum + m.interestRate, 0) / mortgages.length;
const avgTermMonths = Math.round(
  mortgages.reduce((sum, m) => sum + m.termRemainingMonths, 0) / mortgages.length
);

const summaryStats = [
  {
    label: 'Total Mortgage Debt',
    value: `£${(totalDebt / 1000).toFixed(0)}K`,
    icon: Landmark,
    iconBg: 'bg-blue-100 dark:bg-blue-900/30',
    iconColor: 'text-blue-500',
  },
  {
    label: 'Avg Interest Rate',
    value: `${avgRate.toFixed(1)}%`,
    icon: Percent,
    iconBg: 'bg-emerald-100 dark:bg-emerald-900/30',
    iconColor: 'text-emerald-500',
  },
  {
    label: 'Avg Time to Renewal',
    value: `${avgTermMonths} mo`,
    icon: CalendarDays,
    iconBg: 'bg-amber-100 dark:bg-amber-900/30',
    iconColor: 'text-amber-500',
  },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatCurrency(value: number) {
  return `£${value.toLocaleString('en-GB')}`;
}

function formatTerm(months: number) {
  return months === 0 ? '0 months' : `${months} month${months !== 1 ? 's' : ''}`;
}

// ── Sub-components ────────────────────────────────────────────────────────────

function SummaryCard({
  label,
  value,
  icon: Icon,
  iconBg,
  iconColor,
}: (typeof summaryStats)[number]) {
  return (
    <Card className='rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm'>
      <CardContent className='px-6 py-3'>
        <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center mb-4`}>
          <Icon className={`size-6 ${iconColor}`} />
        </div>
        <p className='text-2xl font-bold text-gray-900 dark:text-white'>{value}</p>
        <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>{label}</p>
      </CardContent>
    </Card>
  );
}

function MortgageCard({ mortgage }: { mortgage: Mortgage }) {
  return (
    <div className='rounded-2xl bg-[#0f172a] text-white p-6 space-y-5'>
      {/* Top row: property + lender name + rate */}
      <div className='flex items-start justify-between'>
        <div>
          <p className='text-sm text-gray-400'>{mortgage.property}</p>
          <div className='flex items-center gap-3 mt-1 flex-wrap'>
            <h2 className='text-xl font-bold'>
              {mortgage.lender} – {mortgage.type}
            </h2>
            {mortgage.renewalDue && (
              <span className='flex items-center gap-1.5 bg-red-500/15 border border-red-500/40 text-red-400 text-xs font-semibold px-3 py-1 rounded-full'>
                <TriangleAlert className='size-3.5' />
                Renewal Due
              </span>
            )}
          </div>
        </div>
        <div className='text-right shrink-0'>
          <p className='text-xs text-gray-400'>Rate</p>
          <p className='text-2xl font-bold'>{mortgage.interestRate}%</p>
        </div>
      </div>

      {/* Outstanding balance */}
      <div>
        <p className='text-3xl font-bold'>{formatCurrency(mortgage.outstandingBalance)}</p>
        <p className='text-sm text-gray-400 mt-1'>Outstanding Balance</p>
      </div>

      {/* Divider */}
      <div className='border-t border-white/10' />

      {/* Three stats */}
      <div className='grid grid-cols-3 gap-4'>
        <div>
          <p className='text-xs text-gray-400'>Original Loan</p>
          <p className='text-base font-semibold mt-1'>{formatCurrency(mortgage.originalLoan)}</p>
        </div>
        <div>
          <p className='text-xs text-gray-400'>Monthly Payment</p>
          <p className='text-base font-semibold mt-1'>{formatCurrency(mortgage.monthlyPayment)}</p>
        </div>
        <div>
          <p className='text-xs text-gray-400'>Term Remaining</p>
          <p className='text-base font-semibold mt-1'>{formatTerm(mortgage.termRemainingMonths)}</p>
        </div>
      </div>

      {/* Divider */}
      <div className='border-t border-white/10' />

      {/* Action buttons */}
      <div className='flex items-center gap-3'>
        <button className='flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-colors text-white text-sm font-medium px-4 py-2 rounded-xl'>
          <FileText className='size-4' />
          View Documents
        </button>
        <button className='flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-colors text-white text-sm font-medium px-4 py-2 rounded-xl'>
          <Calculator className='size-4' />
          Remortgage Calculator
        </button>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function MortgagesPage() {
  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-start justify-between'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight text-gray-900 dark:text-white'>
            Mortgages
          </h1>
          <p className='text-sm text-gray-500 dark:text-gray-400'>
            Track and manage your property financing
          </p>
        </div>
        <button className='flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors'>
          <Plus className='size-4' />
          Add Mortgage
        </button>
      </div>

      {/* Summary cards */}
      <div className='grid gap-4 grid-cols-1 md:grid-cols-3'>
        {summaryStats.map((stat) => (
          <SummaryCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Mortgage cards */}
      <div className='space-y-4'>
        {mortgages.map((mortgage) => (
          <MortgageCard key={mortgage.id} mortgage={mortgage} />
        ))}
      </div>
    </div>
  );
}