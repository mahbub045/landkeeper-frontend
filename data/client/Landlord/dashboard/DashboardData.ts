import {
  ActivityItem,
  AlertItem,
  BadgeVariant,
} from '@/types/client/Landlord/Dashboard/DashboardTypes';
import {
  AlertCircle,
  Clock,
  FileText,
  PoundSterling,
  RefreshCw,
  Upload,
  UserPlus,
  Wrench,
} from 'lucide-react';

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

export const activities: ActivityItem[] = [
  {
    id: 1,
    icon: Upload,
    iconBg: 'bg-blue-100 dark:bg-blue-900/30',
    iconColor: 'text-blue-500',
    accentColor: 'bg-blue-500',
    title: 'Document Uploaded',
    titleColor: 'text-blue-600 dark:text-blue-400',
    subtitle: 'Tenancy Agreement · 14 Oak Street',
    time: '2 hours ago',
  },
  {
    id: 2,
    icon: PoundSterling,
    iconBg: 'bg-emerald-100 dark:bg-emerald-900/30',
    iconColor: 'text-emerald-500',
    accentColor: 'bg-emerald-500',
    title: 'Rent Received',
    titleColor: 'text-emerald-600 dark:text-emerald-400',
    subtitle: '£850 from Sarah Johnson · 14 Oak Street',
    time: '5 hours ago',
  },
  {
    id: 3,
    icon: Wrench,
    iconBg: 'bg-amber-100 dark:bg-amber-900/30',
    iconColor: 'text-amber-500',
    accentColor: 'bg-amber-500',
    title: 'Maintenance Request',
    titleColor: 'text-amber-600 dark:text-amber-400',
    subtitle: 'Plumbing issue reported · 42 Maple Avenue',
    time: '1 day ago',
  },
  {
    id: 4,
    icon: UserPlus,
    iconBg: 'bg-purple-100 dark:bg-purple-900/30',
    iconColor: 'text-purple-500',
    accentColor: 'bg-purple-500',
    title: 'New Tenant Added',
    titleColor: 'text-purple-600 dark:text-purple-400',
    subtitle: 'Michael Brown · 8 Pine Road',
    time: '2 days ago',
  },
];

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
