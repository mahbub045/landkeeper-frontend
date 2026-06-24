'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MortgageCardProps } from '@/types/client/Common/Mortgage/MortgageTypes';
import { formatTerm, getCurrencySign } from '@/utils/formatters';
import { Calculator, FileText, TriangleAlert } from 'lucide-react';

const MortgageCard: React.FC<MortgageCardProps> = ({ mortgage }) => {
  return (
    <Card className='shadow-lg'>
      <CardContent className='space-y-5 p-6'>
        {/* Top row: property + lender name + rate */}
        <div className='flex items-start justify-between'>
          <div>
            <p className='text-muted-foreground text-sm'>{mortgage.property}</p>
            <div className='mt-1 flex flex-wrap items-center gap-3'>
              <h2 className='text-xl font-bold'>
                {mortgage.lender} – {mortgage.type}
              </h2>
              {mortgage.renewalDue && (
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
            <p className='text-2xl font-bold'>{mortgage.interestRate}%</p>
          </div>
        </div>

        {/* Outstanding balance */}
        <div>
          <p className='text-3xl font-bold'>
            {getCurrencySign()}
            {mortgage.outstandingBalance.toLocaleString('en-GB')}
          </p>
          <p className='text-muted-foreground mt-1 text-sm'>
            Outstanding Balance
          </p>
        </div>

        <div className='border-border border-t' />

        {/* Three stats */}
        <div className='grid grid-cols-3 gap-4'>
          <div>
            <p className='text-muted-foreground text-xs'>Original Loan</p>
            <p className='mt-1 text-base font-semibold'>
              {getCurrencySign()}
              {mortgage.originalLoan}
            </p>
          </div>
          <div>
            <p className='text-muted-foreground text-xs'>Monthly Payment</p>
            <p className='mt-1 text-base font-semibold'>
              {getCurrencySign()}
              {mortgage.monthlyPayment}
            </p>
          </div>
          <div>
            <p className='text-muted-foreground text-xs'>Term Remaining</p>
            <p className='mt-1 text-base font-semibold'>
              {formatTerm(mortgage.termRemainingMonths)}
            </p>
          </div>
        </div>

        <div className='border-border border-t' />

        {/* Action buttons */}
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
