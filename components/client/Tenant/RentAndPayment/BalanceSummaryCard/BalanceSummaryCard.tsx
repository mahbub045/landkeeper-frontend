import { CalendarClock, CircleAlert, CircleCheck, Coins } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ApiRentBalanceSummary } from '@/types/client/Tenant/TenantTypes';
import {
  formatCurrency,
  formatDate,
  getDaysUntilDue,
} from '@/utils/formatters';

const NOT_AVAILABLE = 'Not Available';

export const BalanceSummaryCard: React.FC<{
  summary?: ApiRentBalanceSummary;
}> = ({ summary }) => {
  const hasRentAmount = summary?.current_rent_amount != null;
  const hasDueDate = summary?.next_due_date != null;
  const hasOutstandingBalance = summary?.outstanding_balance != null;

  const daysUntilDue = hasDueDate
    ? getDaysUntilDue(summary!.next_due_date as string)
    : null;
  const isAccountUpToDate = hasOutstandingBalance
    ? (summary!.outstanding_balance as number) <= 0
    : null;

  return (
    <div className='grid gap-4 sm:grid-cols-3'>
      <Card>
        <CardContent className='flex items-start gap-3 pt-6'>
          <Coins className='text-primary h-5 w-5' />
          <div>
            <p className='text-muted-foreground text-sm'>Current Rent Amount</p>
            <p
              className={cn(
                'text-2xl font-semibold',
                !hasRentAmount && 'text-muted-foreground text-base font-normal',
              )}
            >
              {hasRentAmount
                ? formatCurrency(summary!.current_rent_amount as number)
                : NOT_AVAILABLE}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className='flex items-start gap-3 pt-6'>
          <CalendarClock className='text-secondary h-5 w-5' />
          <div>
            <p className='text-muted-foreground text-sm'>Next Due Date</p>
            <p
              className={cn(
                'text-2xl font-semibold',
                !hasDueDate && 'text-muted-foreground text-base font-normal',
              )}
            >
              {hasDueDate
                ? formatDate(summary!.next_due_date as string)
                : NOT_AVAILABLE}
            </p>
            {daysUntilDue !== null && (
              <p className='text-muted-foreground text-xs'>
                {daysUntilDue >= 0
                  ? `Payment due in ${daysUntilDue} days`
                  : `Payment overdue by ${Math.abs(daysUntilDue)} days`}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className='flex items-start gap-3 pt-6'>
          {isAccountUpToDate === null ? (
            <CircleAlert className='text-muted-foreground h-5 w-5' />
          ) : isAccountUpToDate ? (
            <CircleCheck className='text-success h-5 w-5' />
          ) : (
            <CircleAlert className='text-danger h-5 w-5' />
          )}
          <div>
            <p className='text-muted-foreground text-sm'>
              Outstanding Balance / Arrears
            </p>
            <p
              className={cn(
                'text-2xl font-semibold',
                isAccountUpToDate === null
                  ? 'text-muted-foreground text-base font-normal'
                  : isAccountUpToDate
                    ? 'text-success'
                    : 'text-danger',
              )}
            >
              {hasOutstandingBalance
                ? formatCurrency(summary!.outstanding_balance as number)
                : NOT_AVAILABLE}
            </p>
            {isAccountUpToDate !== null && (
              <p className='text-muted-foreground text-xs'>
                {isAccountUpToDate
                  ? 'Account fully up to date'
                  : 'Payment overdue'}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
