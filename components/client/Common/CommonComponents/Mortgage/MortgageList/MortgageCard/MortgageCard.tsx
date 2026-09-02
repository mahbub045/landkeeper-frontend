'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  epcStyles,
  expiryUrgencyStyles,
} from '@/data/client/common/mortgage/MortgageData';
import { Mortgage } from '@/types/client/Common/Mortgage/MortgageTypes';
import formatChoiceFieldValue, {
  formatDate,
  getCurrencySign,
  getDaysUntilDue,
} from '@/utils/formatters';
import { Calendar } from 'lucide-react';

const MortgageCard: React.FC<{ mortgage: Mortgage }> = ({ mortgage }) => {
  const rateExpiryDays = getDaysUntilDue(mortgage.interest_rate_expiry_date);

  return (
    <div className='group relative overflow-visible'>
      {/* Animated Gradient Glow */}
      <div className='from-primary via-secondary to-primary absolute -inset-2 z-0 rounded-[24px] bg-linear-to-r opacity-0 blur-xl transition-all duration-700 group-hover:opacity-100' />

      <Card className='relative z-10 min-w-0 py-0 shadow-md transition-all duration-700 group-hover:-translate-y-1.5 group-hover:shadow-xl'>
        <CardContent className='min-w-0 space-y-3 p-4 sm:p-6'>
          {/* Header */}
          <div className='flex items-start justify-between gap-3'>
            <div className='min-w-0'>
              <p className='text-muted-foreground truncate text-sm'>
                {mortgage.property.property_name}
              </p>
              <h2 className='mt-0.5 truncate text-lg font-bold'>
                {mortgage.lender_name}
              </h2>
              <p className='text-muted-foreground mt-0.5 text-xs'>
                {formatChoiceFieldValue(mortgage.interest_rate_type)}
                {mortgage.remaining_mortgage != null &&
                  ` · ${mortgage.remaining_mortgage} yrs remaining`}
              </p>
            </div>

            {mortgage.epc_rating && (
              <Badge
                variant='outline'
                className={`shrink-0 font-mono text-xs ${epcStyles(mortgage.epc_rating)}`}
              >
                EPC:{mortgage.epc_rating}
              </Badge>
            )}
          </div>

          {/* Stats */}
          <div>
            <div className='min-w-0'>
              <p className='truncate text-lg font-bold tracking-tight sm:text-xl'>
                {getCurrencySign()}
                {parseFloat(mortgage.outstanding_balance ?? '0').toLocaleString(
                  'en-GB',
                )}
              </p>
              <p className='text-muted-foreground mt-1 text-xs'>
                Outstanding Balance
              </p>
            </div>

            <div className='mt-4 flex min-w-0 shrink-0 justify-between gap-4 sm:gap-6'>
              <div>
                <p className='font-mono text-lg font-semibold'>
                  {parseFloat(mortgage.interest_rate ?? '0')}%
                </p>
                <p className='text-muted-foreground text-xs'>Interest Rate</p>
              </div>

              <div>
                <p className='font-mono text-lg font-semibold'>
                  {getCurrencySign()}
                  {parseFloat(mortgage?.monthly_payment ?? '0').toLocaleString(
                    'en-GB',
                  )}
                </p>
                <p className='text-muted-foreground text-xs'>Per Month</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Footer */}
          <div className='flex items-start gap-3'>
            {mortgage.interest_rate_expiry_date ? (
              <div
                className={`flex items-center gap-1.5 text-xs ${expiryUrgencyStyles(rateExpiryDays)}`}
              >
                <Calendar className='size-3.5' />
                <span className='min-w-0'>
                  Rate fixed until{' '}
                  {formatDate(mortgage.interest_rate_expiry_date)}
                  {rateExpiryDays !== null && rateExpiryDays >= 0 && (
                    <span className='ml-1 opacity-80'>({rateExpiryDays}d)</span>
                  )}
                </span>
              </div>
            ) : (
              <div className='text-muted-foreground flex items-center gap-1.5 text-xs'>
                <Calendar className='size-3.5' />
                <span>Rate not fixed</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MortgageCard;
