'use client';

import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import {
  useSubscriptionPlanDetailsQuery,
  useUpdateAutoRenewMutation,
} from '@/store/api/endpoints/client/Landlord/BillingAndPlans/Billing/BillingApi';
import {
  SubscriptionDetails,
  SubscriptionFeature,
  SubscriptionStatus,
} from '@/types/client/Landlord/BillingAndPlans/BillingType';
import formatChoiceFieldValue, { formatDate } from '@/utils/formatters';
import { CalendarDays, CreditCard, Sparkles } from 'lucide-react';
import Link from 'next/link';

const statusDotStyles: Record<SubscriptionStatus, string> = {
  PENDING: 'bg-slate-400',
  ACTIVE: 'bg-emerald-500',
  TRIALING: 'bg-blue-500',
  PAST_DUE: 'bg-amber-500',
  CANCELLED: 'bg-destructive',
  EXPIRED: 'bg-muted-foreground',
};
const statusBgStyles: Record<SubscriptionStatus, string> = {
  PENDING: 'bg-slate-100 text-slate-800',
  ACTIVE: 'bg-emerald-100 text-emerald-800',
  TRIALING: 'bg-blue-100 text-blue-800',
  PAST_DUE: 'bg-amber-100 text-amber-800',
  CANCELLED: 'bg-destructive/10 text-destructive',
  EXPIRED: 'bg-muted-foreground/10 text-muted-foreground',
};
const planTierAccent: Record<string, string> = {
  BASIC: 'before:bg-slate-400',
  STANDARD: 'before:bg-primary',
  PREMIUM: 'before:bg-amber-500',
};

export default function OverviewTab() {
  const {
    data: subscription,
    isLoading,
    isError,
  } = useSubscriptionPlanDetailsQuery(undefined) as {
    data: SubscriptionDetails | undefined;
    isLoading: boolean;
    isError: boolean;
  };
  const [updateAutoRenew, { isLoading: isUpdatingAutoRenew }] =
    useUpdateAutoRenewMutation();

  const handleAutoRenewToggle = (checked: boolean) => {
    updateAutoRenew({ auto_renew: checked });
  };

  if (isLoading) {
    return (
      <>
        <div className='grid gap-5 lg:grid-cols-3'>
          <div className='border-border/70 col-span-2 space-y-6 rounded-2xl border bg-white p-6 dark:bg-white/4'>
            <div className='bg-muted h-6 w-32 animate-pulse rounded' />
            <div className='bg-muted h-9 w-40 animate-pulse rounded' />
            <div className='bg-muted h-10 w-32 animate-pulse rounded' />
          </div>
          <div className='border-border/70 space-y-4 rounded-2xl border bg-white p-6 dark:bg-white/4'>
            <div className='bg-muted h-5 w-40 animate-pulse rounded' />
            <div className='bg-muted h-4 w-full animate-pulse rounded' />
            <div className='bg-muted h-4 w-full animate-pulse rounded' />
          </div>
        </div>

        <div className='border-border/70 col-span-2 mt-4 space-y-6 rounded-2xl border bg-white p-6 dark:bg-white/4'>
          <div className='bg-muted h-6 w-32 animate-pulse rounded' />
          <div className='bg-muted h-9 w-40 animate-pulse rounded' />
          <div className='bg-muted h-10 w-32 animate-pulse rounded' />
        </div>
      </>
    );
  }

  if (isError || !subscription) {
    return (
      <div className='border-destructive/40 bg-destructive/5 rounded-2xl border border-dashed px-6 py-10 text-center'>
        <p className='font-medium'>Could not load your subscription.</p>
        <p className='text-muted-foreground mt-1 text-sm'>
          Please refresh and try again.
        </p>
      </div>
    );
  }

  return (
    <div className='space-y-5'>
      <div className='grid items-stretch gap-5 lg:grid-cols-3'>
        {/* Current plan */}
        <div
          className={cn(
            "border-border/70 relative col-span-2 flex h-full flex-col overflow-hidden rounded-2xl border bg-white py-6 pr-6 pl-7 before:absolute before:top-0 before:left-0 before:h-full before:w-1 before:content-[''] dark:bg-white/4",
            planTierAccent[subscription.plan.plan_type] ?? 'before:bg-border',
          )}
        >
          <div className='flex items-center justify-between gap-4'>
            <div className='flex items-center gap-2'>
              <CreditCard
                className='text-muted-foreground size-4'
                aria-hidden='true'
              />
              <span className='text-sm font-semibold'>Current plan</span>
            </div>
            <span
              className={
                'border-border/70 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ' +
                statusBgStyles[subscription.status]
              }
            >
              <span
                className={cn(
                  'size-1.5 rounded-full',
                  statusDotStyles[subscription.status],
                )}
              />
              {formatChoiceFieldValue(subscription.status)}
            </span>
          </div>

          <div className='mt-5 flex flex-wrap items-end justify-between gap-x-6 gap-y-1'>
            <h2 className='text-3xl font-semibold tracking-tight'>
              {subscription.plan.name}
            </h2>
            <div className='text-right'>
              <span className='text-3xl font-semibold tracking-[-0.02em]'>
                ${Number(subscription.plan.monthly_price).toFixed(2)}
              </span>
              <span className='text-muted-foreground text-sm'> /month</span>
            </div>
          </div>

          <p className='text-muted-foreground mt-1.5 max-w-md text-sm'>
            {subscription.plan.description || 'No description provided.'}
          </p>

          <div className='border-border/70 mt-3 flex items-center gap-6 border-t p-1'>
            <div>
              <div className='text-lg font-semibold'>
                {subscription.plan.max_properties}
              </div>
              <div className='text-muted-foreground text-sm'>
                Max properties
              </div>
            </div>
            <div className='bg-border/70 h-8 w-px' />
            <div>
              <div className='text-lg font-semibold'>
                {subscription.plan.referral_discount_percent}%
              </div>
              <div className='text-muted-foreground text-sm'>
                Referral discount
              </div>
            </div>
          </div>

          <div className='border-border/70 mt-auto border-t pt-5'>
            <Button asChild variant='default'>
              <Link href='/client/landlord/billing-and-plans/pricing-plans'>
                Change plan
              </Link>
            </Button>
          </div>
        </div>

        {/* Subscription details */}
        <div className='border-border/70 flex h-full flex-col rounded-2xl border bg-white p-6 dark:bg-white/4'>
          <div className='mb-4 flex items-center gap-2'>
            <CalendarDays
              className='text-muted-foreground size-4'
              aria-hidden='true'
            />
            <span className='text-sm font-semibold'>Subscription details</span>
          </div>

          <div className='flex flex-1 flex-col justify-center'>
            <dl className='space-y-3 text-sm'>
              <div className='flex items-center justify-between'>
                <dt className='text-muted-foreground'>Auto renew</dt>
                <dd className='flex items-center gap-2'>
                  <span
                    className={cn(
                      'text-xs font-semibold',
                      subscription.auto_renew
                        ? 'text-primary'
                        : 'text-muted-foreground',
                    )}
                  >
                    {subscription.auto_renew ? 'Enabled' : 'Disabled'}
                  </span>
                  <Switch
                    checked={subscription.auto_renew}
                    disabled={isUpdatingAutoRenew}
                    onCheckedChange={handleAutoRenewToggle}
                    aria-label='Toggle auto renew'
                    className='cursor-pointer'
                  />
                </dd>
              </div>

              <div className='border-border/70 space-y-2.5 border-t pt-3'>
                <div className='flex items-center justify-between'>
                  <dt className='text-muted-foreground'>Start date</dt>
                  <dd className='font-medium'>
                    {subscription.start_date
                      ? formatDate(subscription.start_date)
                      : 'N/A'}
                  </dd>
                </div>
                <div className='flex items-center justify-between'>
                  <dt className='text-muted-foreground'>End date</dt>
                  <dd className='font-medium'>
                    {subscription.end_date
                      ? formatDate(subscription.end_date)
                      : 'N/A'}
                  </dd>
                </div>
                <div className='flex items-center justify-between'>
                  <dt className='text-muted-foreground'>Next billing</dt>
                  <dd className='font-medium'>
                    {subscription.next_billing_date
                      ? formatDate(subscription.next_billing_date)
                      : 'N/A'}
                  </dd>
                </div>
              </div>
            </dl>

            <p className='text-muted-foreground mt-4 text-right text-xs'>
              (A month is considered to be 30 days.)
            </p>
          </div>
        </div>
      </div>

      {/* Plan features */}
      {subscription.plan.features && subscription.plan.features.length > 0 && (
        <div className='border-border/70 rounded-2xl border bg-white p-6 dark:bg-white/4'>
          <div className='mb-4 flex items-center gap-2'>
            <Sparkles className='text-success size-4' aria-hidden='true' />
            <span className='text-sm font-semibold'>Plan features</span>
          </div>

          <ul className='grid gap-2.5 sm:grid-cols-2'>
            {subscription.plan.features.map((feature: SubscriptionFeature) => (
              <li
                key={feature.code}
                className='bg-muted/40 flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm shadow-md'
              >
                <span className='bg-primary size-1.5 shrink-0 rounded-full' />
                {feature.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
