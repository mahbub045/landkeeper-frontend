import { CalendarClock, CircleAlert, CircleCheck, Coins } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { RentSummary } from '@/types/client/Tenant/TenantTypes';

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(amount);
}

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(dateString));
}

export const BalanceSummaryCard: React.FC<{ summary: RentSummary }> = ({
  summary,
}) => {
  return (
    <div className='grid gap-4 sm:grid-cols-3'>
      <Card>
        <CardContent className='flex items-start gap-3 pt-6'>
          <Coins className='text-primary h-5 w-5' />
          <div>
            <p className='text-muted-foreground text-sm'>Current Rent Amount</p>
            <p className='text-2xl font-semibold'>
              {formatCurrency(summary.currentRentAmount)}
            </p>
            <p className='text-muted-foreground text-xs'>
              {summary.rentFrequencyLabel}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className='flex items-start gap-3 pt-6'>
          <CalendarClock className='text-secondary h-5 w-5' />
          <div>
            <p className='text-muted-foreground text-sm'>Next Due Date</p>
            <p className='text-2xl font-semibold'>
              {formatDate(summary.nextDueDate)}
            </p>
            <p className='text-muted-foreground text-xs'>
              Payment due in {summary.daysUntilDue} days
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className='flex items-start gap-3 pt-6'>
          {summary.isAccountUpToDate ? (
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
                summary.isAccountUpToDate ? 'text-success' : 'text-danger',
              )}
            >
              {formatCurrency(summary.outstandingBalance)}
            </p>
            <p className='text-muted-foreground text-xs'>
              {summary.isAccountUpToDate
                ? 'Account fully up to date'
                : 'Payment overdue'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
