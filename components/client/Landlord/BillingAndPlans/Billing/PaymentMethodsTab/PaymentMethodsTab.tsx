'use client';

import { Button } from '@/components/ui/button';
import { CreditCard, Plus } from 'lucide-react';

export default function PaymentMethodsTab() {
  // TODO: wire up to your saved payment methods endpoint once available.
  const paymentMethods: never[] = [];

  return (
    <div className='border-border/70 rounded-2xl border bg-white p-6 dark:bg-white/4'>
      <div className='mb-5 flex items-center justify-between'>
        <p className='text-sm font-semibold'>Saved payment methods</p>
        <Button size='sm'>
          <Plus />
          Add payment method
        </Button>
      </div>

      {paymentMethods.length === 0 ? (
        <div className='border-border/70 flex flex-col items-center justify-center rounded-xl border border-dashed py-14 text-center'>
          <CreditCard className='text-muted-foreground mb-3 size-8' aria-hidden='true' />
          <p className='font-medium'>No payment methods saved</p>
          <p className='text-muted-foreground mt-1 max-w-xs text-sm'>
            Add a card to make future subscription payments faster.
          </p>
        </div>
      ) : null}
    </div>
  );
}