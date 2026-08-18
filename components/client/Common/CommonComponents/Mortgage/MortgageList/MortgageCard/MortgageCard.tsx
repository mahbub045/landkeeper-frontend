'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { epcStyles, expiryUrgencyStyles } from '@/data/client/common/mortgage/MortgageData';
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
    <Card className='group py-0 shadow-md transition-all hover:-translate-y-1'>
      <CardContent className='space-y-5 p-6'>
        {/* Header */}
        <div className='flex items-start justify-between gap-3'>
          <div className='min-w-0'>
            <p className='text-muted-foreground truncate text-sm'>
              {mortgage.property.property_name}
            </p>
            <h2 className='mt-0.5 truncate text-xl font-bold'>
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
              EPC {mortgage.epc_rating}
            </Badge>
          )}
        </div>

        {/* Stats */}
        <div className='flex items-end justify-between gap-4'>
          <div>
            <p className='text-3xl font-bold tracking-tight'>
              {getCurrencySign()}
              {parseFloat(mortgage.outstanding_balance ?? '0').toLocaleString(
                'en-GB',
              )}
            </p>
            <p className='text-muted-foreground mt-1 text-sm'>
              Outstanding Balance
            </p>
          </div>

          <div className='flex shrink-0 gap-6 text-right'>
            <div>
              <p className='font-mono text-lg font-semibold'>
                {parseFloat(mortgage.interest_rate ?? '0')}%
              </p>
              <p className='text-muted-foreground text-xs'>Interest Rate</p>
            </div>
            {mortgage.monthly_payment && (
              <div>
                <p className='font-mono text-lg font-semibold'>
                  {getCurrencySign()}
                  {parseFloat(mortgage.monthly_payment).toLocaleString('en-GB')}
                </p>
                <p className='text-muted-foreground text-xs'>Per Month</p>
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Footer */}
        <div className='flex items-center justify-between gap-3'>
          {mortgage.interest_rate_expiry_date && (
            <div
              className={`flex items-center gap-1.5 text-xs ${expiryUrgencyStyles(rateExpiryDays)}`}
            >
              <Calendar className='size-3.5' />
              <span>
                Rate fixed until{' '}
                {formatDate(mortgage.interest_rate_expiry_date)}
                {rateExpiryDays !== null && rateExpiryDays >= 0 && (
                  <span className='ml-1 opacity-80'>({rateExpiryDays}d)</span>
                )}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MortgageCard;
