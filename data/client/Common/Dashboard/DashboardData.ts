import {
  AlertSeverity,
  AlertSeverityStyle,
  BadgeVariant,
} from '@/types/client/Common/Dashboard/DashboardTypes';
import { AlertCircle, CalendarClock, Clock } from 'lucide-react';

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
  EICR_CERTIFICATE: '#a78bfa',
  DEPOSIT_PROTECTION_CERTIFICATE: '#6366f1',
  RIGHT_TO_RENT_CHECK: '#ec4899',
  HMO_LICENCE: '#f97316',
  PROPERTY_INSURANCE_CERTIFICATE: '#06b6d4',
  FIRE_SAFETY_CERTIFICATE: '#ef4444',
  SELECTIVE_LICENCE: '#0ea5e9',
  PAT_TESTING_CERTIFICATE: '#8b5cf6',
  PROPERTY_FLOOR_PLANS: '#22c55e',
};

export const ALERT_URGENT_THRESHOLD_DAYS = 15;

export const ALERT_SEVERITY_STYLES: Record<AlertSeverity, AlertSeverityStyle> =
  {
    expired: {
      icon: AlertCircle,
      iconBg: 'bg-red-100 dark:bg-red-900/30',
      iconColor: 'text-red-500',
      titleColor: 'text-red-600 dark:text-red-400',
    },
    urgent: {
      icon: Clock,
      iconBg: 'bg-amber-100 dark:bg-amber-900/30',
      iconColor: 'text-amber-500',
      titleColor: 'text-amber-600 dark:text-amber-400',
    },
    upcoming: {
      icon: CalendarClock,
      iconBg: 'bg-blue-100 dark:bg-blue-900/30',
      iconColor: 'text-blue-400',
      titleColor: 'text-blue-600 dark:text-blue-400',
    },
  };

export const getAlertSeverity = (days: number): AlertSeverity => {
  if (days < 0) return 'expired';
  if (days <= ALERT_URGENT_THRESHOLD_DAYS) return 'urgent';
  return 'upcoming';
};
