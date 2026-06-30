'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Mortgage } from '@/types/client/Common/Mortgage/MortgageTypes';
import { formatTerm, getCurrencySign } from '@/utils/formatters';
import { Calculator, FileText, Pencil, Trash2, TriangleAlert } from 'lucide-react';

const productTypeLabel: Record<string, string> = {
  FIXED_RATE: 'Fixed Rate',
  VARIABLE_RATE: 'Variable Rate',
  INTEREST_ONLY: 'Interest Only',
  TRACKER: 'Tracker',
};

const MortgageCard: React.FC<{ mortgage: Mortgage }> = ({ mortgage }) => {
  const renewalDue = (mortgage.term ?? 0) === 0;

  return (
    <Card className='shadow-lg py-0'>
      <CardContent className='space-y-5 p-6'>
        <div className='flex justify-end border-b border-muted-foreground pb-4'>
          <div className='flex justify-center items-center gap-1'>
              <Button
                variant='default'
                onClick={() => {/* open edit dialog */}}
              >
                <Pencil className='size-4' />
                Edit
              </Button>
              <Button
                variant='danger'
                onClick={() => {/* open delete dialog */}}
              >
                <Trash2 className='size-4' />
                Delete
              </Button>
            </div>
        </div>
        <div className='flex items-start justify-between'>
          <div>
            <p className='text-muted-foreground text-sm'>
              Property #{mortgage.property}
            </p>
            <div className='mt-1 flex flex-wrap items-center gap-3'>
              <h2 className='text-xl font-bold'>
                {mortgage.lender_name} –{' '}
                {productTypeLabel[mortgage.product_type] ??
                  mortgage.product_type}
              </h2>
              {renewalDue && (
                <Badge
                  variant='outline'
                  className='border-danger/40 bg-danger/15 text-danger flex items-center gap-1.5'
                >
                  <TriangleAlert className='size-3.5' />
                  Renewal Due
                </Badge>
              )}
            </div>
          </div>
          <div className='shrink-0 text-right'>
            <p className='text-muted-foreground text-xs'>Rate</p>
            <p className='text-2xl font-bold'>
              {parseFloat(mortgage.interest_rate ?? '0')}%
            </p>
          </div>
        </div>

        <div>
          <p className='text-3xl font-bold'>
            {getCurrencySign()}
            {parseFloat(mortgage.outstanding_balance ?? '0').toLocaleString('en-GB')}
          </p>
          <p className='text-muted-foreground mt-1 text-sm'>
            Outstanding Balance
          </p>
        </div>

        <div className='border-border border-t' />

        <div className='grid grid-cols-3 gap-4'>
          <div>
            <p className='text-muted-foreground text-xs'>Original Loan</p>
            <p className='mt-1 text-base font-semibold'>
              {getCurrencySign()}
              {parseFloat(mortgage.loan_amount ?? '0').toLocaleString('en-GB')}
            </p>
          </div>
          <div>
            <p className='text-muted-foreground text-xs'>Monthly Payment</p>
            <p className='mt-1 text-base font-semibold'>
              {getCurrencySign()}
              {parseFloat(mortgage.monthly_payment ?? '0').toLocaleString('en-GB')}
            </p>
          </div>
          <div>
            <p className='text-muted-foreground text-xs'>Term Remaining</p>
            <p className='mt-1 text-base font-semibold'>
              {formatTerm(mortgage.term)}
            </p>
          </div>
        </div>

        <div className='border-border border-t' />

        <div className='flex items-center gap-3'>
          <Button variant='secondary' size='sm' className='gap-2 rounded-xl'>
            <FileText />
            View Documents
          </Button>
          <Button variant='secondary' size='sm' className='gap-2 rounded-xl'>
            <Calculator />
            Remortgage Calculator
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MortgageCard;
