'use client';

import { Receipt } from 'lucide-react';

export default function BillingHistoryTab() {
  // TODO: wire up to your invoices/billing history endpoint once available.
  const invoices: never[] = [];

  return (
    <div className='border-border/70 rounded-2xl border bg-white p-6 dark:bg-white/4'>
      <p className='mb-5 text-sm font-semibold'>Billing history</p>

      {invoices.length === 0 ? (
        <div className='border-border/70 flex flex-col items-center justify-center rounded-xl border border-dashed py-14 text-center'>
          <Receipt
            className='text-muted-foreground mb-3 size-8'
            aria-hidden='true'
          />
          <p className='font-medium'>No invoices yet</p>
          <p className='text-muted-foreground mt-1 max-w-xs text-sm'>
            Your invoices will show up here after your first billed payment.
          </p>
        </div>
      ) : (
        <div className='border-border/70 overflow-hidden rounded-xl border'>
          <table className='w-full text-sm'>
            <thead className='bg-muted/60'>
              <tr>
                <th className='text-muted-foreground px-4 py-3 text-left text-xs font-semibold tracking-wide'>
                  Date
                </th>
                <th className='text-muted-foreground px-4 py-3 text-left text-xs font-semibold tracking-wide'>
                  Plan
                </th>
                <th className='text-muted-foreground px-4 py-3 text-right text-xs font-semibold tracking-wide'>
                  Amount
                </th>
                <th className='text-muted-foreground px-4 py-3 text-right text-xs font-semibold tracking-wide'>
                  Status
                </th>
              </tr>
            </thead>
            <tbody className='divide-border/70 divide-y' />
          </table>
        </div>
      )}
    </div>
  );
}
