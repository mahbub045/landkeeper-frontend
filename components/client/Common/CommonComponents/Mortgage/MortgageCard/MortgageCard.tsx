'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Mortgage } from '@/types/client/Common/Mortgage/MortgageTypes';
import { formatTerm, getCurrencySign } from '@/utils/formatters';
import { getMortgageUrl } from '@/utils/redirectPath';
import {
  Calculator,
  FileText,
  Pencil,
  Trash2,
  TriangleAlert,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import DeleteMortgageDialog from '../Dialogs/DeleteMortgageDialog';
import UpdateMortgageDialog from '../Dialogs/UpdateMortgageDialog';

const productTypeLabel: Record<string, string> = {
  FIXED_RATE: 'Fixed Rate',
  VARIABLE_RATE: 'Variable Rate',
  TRACKER: 'Tracker',
  OFFSET: 'Offset',
};

const MortgageCard: React.FC<{ mortgage: Mortgage }> = ({ mortgage }) => {
  const renewalDue = (mortgage.term ?? 0) === 0;
  const router = useRouter();
  const { data: session } = useSession();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <Card className='group py-0 shadow-lg transition-all hover:-translate-y-1'>
      <CardContent className='space-y-5 p-6'>
        <div className='flex items-start justify-between'>
          <div>
            <p className='text-muted-foreground text-sm'>
              {mortgage.property.property_name}
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
            {parseFloat(mortgage.outstanding_balance ?? '0').toLocaleString(
              'en-GB',
            )}
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
              {parseFloat(mortgage.monthly_payment ?? '0').toLocaleString(
                'en-GB',
              )}
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

        <div className='flex flex-col items-stretch gap-3 md:flex-row md:items-center md:justify-between'>
          <div className='flex items-center gap-2'>
            <Button variant='secondary' size='sm' className='rounded-xl'>
              <FileText />
              View Documents
            </Button>
            <Button variant='secondary' size='sm' className='rounded-xl'>
              <Calculator />
              Remortgage Calculator
            </Button>
          </div>
          <div className='flex items-center gap-2 opacity-100 md:translate-y-1 md:scale-95 md:opacity-0 md:transition-all md:duration-300 md:ease-out md:group-hover:translate-y-0 md:group-hover:opacity-100'>
            <Button variant='outline' onClick={() => setEditOpen(true)}>
              <Pencil className='size-4' />
              Edit
            </Button>
            <Button variant='outline' onClick={() => setDeleteOpen(true)}>
              <Trash2 className='size-4' />
              Delete
            </Button>
          </div>
        </div>
      </CardContent>

      <UpdateMortgageDialog
        key={mortgage.alias}
        open={editOpen}
        onClose={() => setEditOpen(false)}
        mortgage={mortgage}
      />

      <DeleteMortgageDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onSuccess={() => router.push(getMortgageUrl(session))}
        mortgageAlias={mortgage.alias}
      />
    </Card>
  );
};

export default MortgageCard;
