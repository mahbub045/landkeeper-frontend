'use client';

import Loading from '@/components/common/CustomLoader/Loading';
import { Button } from '@/components/ui/button';
import { cardBrandLabels } from '@/data/client/Landlord/BillingAndPlans/BillingData';
import { cn } from '@/lib/utils';
import { usePaymewntMethodsQuery } from '@/store/api/endpoints/client/Landlord/BillingAndPlans/Billing/BillingApi';
import { PaymentMethod } from '@/types/client/Landlord/BillingAndPlans/BillingType';
import { CreditCard, MoreVertical, Plus, Star } from 'lucide-react';

export default function PaymentMethodsTab() {
  const { data: cards, isLoading } = usePaymewntMethodsQuery(undefined);

  return (
    <div className='border-border/70 rounded-2xl border bg-white p-6 dark:bg-white/4'>
      <div className='mb-5 flex items-center justify-between'>
        <p className='text-sm font-semibold'>Saved payment methods</p>
        <Button size='sm'>
          <Plus />
          Add payment method
        </Button>
      </div>

      {isLoading ? (
        <div className='flex items-center justify-center py-14'>
          <Loading />
        </div>
      ) : cards.length === 0 ? (
        <div className='border-border/70 flex flex-col items-center justify-center rounded-xl border border-dashed py-14 text-center'>
          <CreditCard
            className='text-muted-foreground mb-3 size-8'
            aria-hidden='true'
          />
          <p className='font-medium'>No payment methods saved</p>
          <p className='text-muted-foreground mt-1 max-w-xs text-sm'>
            Add a card to make future subscription payments faster.
          </p>
        </div>
      ) : (
        <ul className='space-y-2.5'>
          {cards.map((card: PaymentMethod) => (
            <li
              key={card.id}
              className='border-border flex items-center gap-3 rounded-md border px-4 py-3'
            >
              <div className='bg-muted flex size-9 shrink-0 items-center justify-center rounded-lg'>
                <CreditCard
                  className='text-muted-foreground size-4'
                  aria-hidden='true'
                />
              </div>

              <div className='flex-1'>
                <p className='text-sm font-medium'>
                  {cardBrandLabels[card.card_brand.toLowerCase()] ??
                    card.card_brand}{' '}
                  <span className='text-muted-foreground font-normal'>
                    •••• {card.last_four}
                  </span>
                </p>
                <p className='text-muted-foreground text-xs'>
                  Expires {String(card.expiry_month).padStart(2, '0')}/
                  {card.expiry_year}
                </p>
              </div>

              {card.is_default && (
                <span
                  className={cn(
                    'bg-primary/10 text-primary flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold',
                  )}
                >
                  <Star
                    className='size-3'
                    aria-hidden='true'
                    fill='currentColor'
                  />
                  Default
                </span>
              )}

              <Button
                type='button'
                variant='ghost'
                size='icon'
                aria-label='More options'
                className='text-muted-foreground'
              >
                <MoreVertical className='size-4' />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
