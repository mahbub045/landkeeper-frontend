import { CalendarClock, CircleAlert, CircleCheck, Coins } from 'lucide-react';

import Loading from '@/components/common/CustomLoader/Loading';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ApiRentBalanceSummary } from '@/types/client/Tenant/RentAndPayments/RentAndPaymentsType';
import {
  formatCurrency,
  formatDate,
  getDaysUntilDue,
} from '@/utils/formatters';

type Tone = 'success' | 'danger' | 'neutral';

const BADGE_STYLES: Record<Tone, string> = {
  success:
    'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  danger: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  neutral: 'bg-muted text-muted-foreground',
};

interface SummaryItem {
  title: string;
  value: string | null;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  valueColor?: string;
  badge?: { label: string; tone: Tone };
}

export const BalanceSummaryCard: React.FC<{
  summary?: ApiRentBalanceSummary;
  isLoading?: boolean;
}> = ({ summary, isLoading = false }) => {
  const hasRentAmount = summary?.current_rent_amount != null;
  const hasDueDate = summary?.next_due_date != null;
  const hasOutstandingBalance = summary?.outstanding_balance != null;

  const daysUntilDue = hasDueDate
    ? getDaysUntilDue(summary!.next_due_date as string)
    : null;
  const isAccountUpToDate = hasOutstandingBalance
    ? (summary!.outstanding_balance as number) <= 0
    : null;

  const items: SummaryItem[] = [
    {
      title: 'Current Rent Amount',
      value: hasRentAmount
        ? formatCurrency(summary!.current_rent_amount as number)
        : null,
      icon: Coins,
      iconBg: 'bg-blue-100 dark:bg-blue-900/30',
      iconColor: 'text-blue-500',
    },
    {
      title: 'Next Due Date',
      value: hasDueDate ? formatDate(summary!.next_due_date as string) : null,
      icon: CalendarClock,
      iconBg: 'bg-amber-100 dark:bg-amber-900/30',
      iconColor: 'text-amber-500',
      badge:
        daysUntilDue === null
          ? undefined
          : daysUntilDue >= 0
            ? { label: `Due in ${daysUntilDue} days`, tone: 'neutral' }
            : {
                label: `Overdue by ${Math.abs(daysUntilDue)} days`,
                tone: 'danger',
              },
    },
    {
      title: 'Outstanding Balance / Arrears',
      value: hasOutstandingBalance
        ? formatCurrency(summary!.outstanding_balance as number)
        : null,
      icon: isAccountUpToDate === false ? CircleAlert : CircleCheck,
      iconBg:
        isAccountUpToDate === false
          ? 'bg-red-100 dark:bg-red-900/30'
          : 'bg-emerald-100 dark:bg-emerald-900/30',
      iconColor:
        isAccountUpToDate === false ? 'text-red-500' : 'text-emerald-500',
      valueColor:
        isAccountUpToDate === null
          ? undefined
          : isAccountUpToDate
            ? 'text-success'
            : 'text-danger',
      badge:
        isAccountUpToDate === null
          ? undefined
          : isAccountUpToDate
            ? { label: 'Account fully up to date', tone: 'success' }
            : { label: 'Payment overdue', tone: 'danger' },
    },
  ];

  return (
    <div className='grid gap-4 sm:grid-cols-3'>
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <Card
            key={item.title}
            className='border-border rounded-2xl py-0 shadow-md'
          >
            <CardContent className='px-5 py-4'>
              <div className='flex items-center gap-3'>
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${item.iconBg}`}
                >
                  <Icon className={`size-4 ${item.iconColor}`} />
                </div>
                <p className='text-muted-foreground text-sm font-medium'>
                  {item.title}
                </p>
              </div>

              {isLoading ? (
                <div className='mt-2 flex h-8 items-center'>
                  <Loading className='text-muted-foreground size-5' />
                </div>
              ) : item.value !== null ? (
                <p
                  className={cn(
                    'text-foreground mt-2 text-2xl font-bold',
                    item.valueColor,
                  )}
                >
                  {item.value}
                </p>
              ) : (
                <p className='text-muted-foreground mt-2 text-sm'>
                  Not Available
                </p>
              )}

              {!isLoading && item.badge && (
                <span
                  className={cn(
                    'mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium',
                    BADGE_STYLES[item.badge.tone],
                  )}
                >
                  {item.badge.label}
                </span>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
