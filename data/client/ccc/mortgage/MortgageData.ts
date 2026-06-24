import {
  Mortgage,
  SummaryStat,
} from '@/types/client/Common/Mortgage/MortgageTypes';
import { CalendarDays, Landmark, Percent } from 'lucide-react';

export const mortgages: Mortgage[] = [
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

// ── Derived summary stats ─────────────────────────────────────────────────────

const totalDebt = mortgages.reduce((sum, m) => sum + m.outstandingBalance, 0);
const avgRate =
  mortgages.reduce((sum, m) => sum + m.interestRate, 0) / mortgages.length;
const avgTermMonths = Math.round(
  mortgages.reduce((sum, m) => sum + m.termRemainingMonths, 0) /
    mortgages.length,
);

export const summaryStats: SummaryStat[] = [
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
