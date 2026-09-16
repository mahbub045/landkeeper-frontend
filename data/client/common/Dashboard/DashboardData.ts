import {
  AlertItem,
  BadgeVariant,
} from '@/types/client/Common/Dashboard/DashboardTypes';
import { AlertCircle, Clock, FileText, RefreshCw } from 'lucide-react';

export const badgeStyles: Record<BadgeVariant, string> = {
  up: 'bg-success/15 text-success border-transparent',
  down: 'bg-danger/15 text-danger border-transparent',
  alert:
    'bg-transparent text-foreground border-transparent font-semibold text-sm shadow-none',
};

export const PROPERTY_TYPE_COLORS: Record<string, string> = {
  RESIDENTIAL: '#4f6ef7',
  HMO: '#f59e0b',
  COMMERCIAL: '#a78bfa',
  BUNGALOW: '#22c55e',
  HOUSE: '#ec4899',
  FLAT: '#06b6d4',
  MAISONETTE: '#f97316',
  HOLIDAY_LET: '#14b8a6',
};

export const FALLBACK_COLOR = '#94a3b8';

export const COMPLIANCE_TYPE_COLORS: Record<string, string> = {
  GAS_SAFETY_CERTIFICATE: '#4f6ef7',
  EPC_CERTIFICATE: '#f59e0b',
  ELECTRICAL_SAFETY_CERTIFICATE: '#a78bfa',
  FIRE_RISK_ASSESSMENT: '#ef4444',
  HMO_LICENCE: '#f97316',
  PAT_TESTING: '#8b5cf6',
  LEGIONELLA_ASSESSMENT: '#22c55e',
  INSURANCE_DOCUMENT: '#06b6d4',
};

export const alerts: AlertItem[] = [
  {
    id: 1,
    icon: AlertCircle,
    iconBg: 'bg-red-100 dark:bg-red-900/30',
    iconColor: 'text-red-500',
    title: 'Gas Safety Certificate Expired',
    subtitle: '14 Oak Street · Expired 3 days ago',
  },
  {
    id: 2,
    icon: Clock,
    iconBg: 'bg-amber-100 dark:bg-amber-900/30',
    iconColor: 'text-amber-500',
    title: 'EPC Renewal Due',
    subtitle: '42 Maple Avenue · Expires in 14 days',
  },
  {
    id: 3,
    icon: RefreshCw,
    iconBg: 'bg-blue-100 dark:bg-blue-900/30',
    iconColor: 'text-blue-400',
    title: 'Mortgage Renewal',
    subtitle: '8 Pine Road · Fixed term ends in 45 days',
  },
  {
    id: 4,
    icon: FileText,
    iconBg: 'bg-amber-100 dark:bg-amber-900/30',
    iconColor: 'text-amber-500',
    title: 'Tenancy Renewal',
    subtitle: "23 Elm Drive · Sarah Johnson's lease ends in 30 days",
  },
];

export const incomeExpensesData = [
  { month: 'Jan', income: 4150, expenses: 1580 },
  { month: 'Feb', income: 4150, expenses: 1520 },
  { month: 'Mar', income: 4200, expenses: 1640 },
  { month: 'Apr', income: 4150, expenses: 1600 },
  { month: 'May', income: 4250, expenses: 1560 },
  { month: 'Jun', income: 4200, expenses: 1510 },
];
