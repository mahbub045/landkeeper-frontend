'use client';

import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import {
  useCancelPendingDowngradeMutation,
  useSubscriptionPlanDetailsQuery,
  useUpdateAutoRenewMutation,
} from '@/store/api/endpoints/client/Landlord/BillingAndPlans/Billing/BillingApi';
import {
  SubscriptionDetails,
  SubscriptionFeature,
  SubscriptionStatus,
} from '@/types/client/Landlord/BillingAndPlans/BillingType';
import formatChoiceFieldValue, { formatDateAndTime } from '@/utils/formatters';
import {
  ArrowRight,
  Building2,
  CalendarClock,
  CalendarDays,
  CreditCard,
  Sparkles,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';
import Swal from 'sweetalert2';
import RemovePendingPlanDialog from './Dialogs/RemovePendingPlanDialog';

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

function getElapsedPercent(startDate: string, effectiveDate: string) {
  const start = new Date(startDate).getTime();
  const end = new Date(effectiveDate).getTime();
  const now = Date.now();

  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) {
    return 0;
  }

  const percent = ((now - start) / (end - start)) * 100;
  return Math.min(100, Math.max(0, percent));
}

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
  const [cancelPendingDowngrade, { isLoading: isRemovePending }] =
    useCancelPendingDowngradeMutation();
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);

  const getErrorMessage = (error: unknown, fallback: string): string => {
    const errorData =
      error && typeof error === 'object' && 'data' in error
        ? (error as { data?: unknown }).data
        : null;
    const errorMessage =
      errorData && typeof errorData === 'object'
        ? (errorData as { detail?: string; message?: string }).detail ||
          (errorData as { detail?: string; message?: string }).message
        : null;

    return (
      errorMessage ||
      (error instanceof Error ? error.message : null) ||
      fallback
    );
  };

  const handleAutoRenewToggle = async (checked: boolean) => {
    try {
      const response = await updateAutoRenew({
        auto_renew: checked,
      }).unwrap();

      toast.success(
        `Auto renew ${response.auto_renew ? 'enabled' : 'disabled'} successfully.`,
      );
    } catch (error: unknown) {
      Swal.fire({
        title: 'Error',
        text: getErrorMessage(
          error,
          'Could not update auto renew. Please try again.',
        ),
        icon: 'error',
      });
    }
  };

  const handleRemovePendingPlan = async () => {
    try {
      const response = await cancelPendingDowngrade(undefined).unwrap();

      toast.success(
        response?.detail ||
          "Your scheduled plan change has been removed. You're staying on your current plan.",
      );
      setIsRemoveDialogOpen(false);
    } catch (error: unknown) {
      toast.error(
        getErrorMessage(
          error,
          'Could not remove the scheduled plan. Please try again.',
        ),
      );
    }
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

        <div className='border-border/70 mt-4 space-y-4 rounded-2xl border bg-white p-6 dark:bg-white/4'>
          <div className='bg-muted h-5 w-48 animate-pulse rounded' />
          <div className='bg-muted h-4 w-full animate-pulse rounded' />
          <div className='bg-muted h-4 w-2/3 animate-pulse rounded' />
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
        <Link href='/client/landlord/billing-and-plans/pricing-plans'>
          <Button variant='outline' className='mt-4'>
            <Sparkles className='text-success h-4 w-4' />
            View pricing plans
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className='space-y-5'>
      <div className='grid items-stretch gap-5 lg:grid-cols-3'>
        {/* Current plan */}
        <div
          className={cn(
            "border-border/70 relative flex h-full flex-col overflow-hidden rounded-2xl border bg-white py-6 pr-6 pl-7 before:absolute before:top-0 before:left-0 before:h-full before:w-1 before:content-[''] lg:col-span-2 dark:bg-white/4",
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

            <div className='flex flex-col items-center gap-1'>
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
              {subscription.status === 'TRIALING' && (
                <span className='text-danger text-xs'>
                  {subscription.trial_days_left ?? 0} days left in trial
                </span>
              )}
            </div>
          </div>

          <div className='mt-5 flex flex-wrap items-start justify-between gap-x-6 gap-y-3'>
            <div>
              <h2 className='text-3xl font-semibold tracking-tight'>
                {subscription.plan.name}
              </h2>
              <p className='text-muted-foreground mt-1.5 max-w-md text-sm'>
                {subscription.plan.description || 'No description provided.'}
              </p>
            </div>

            <div className='flex flex-col items-end gap-2'>
              <div className='text-right'>
                <span className='text-3xl font-semibold tracking-[-0.02em]'>
                  ${Number(subscription.plan.monthly_price).toFixed(2)}
                </span>
                <span className='text-muted-foreground text-sm'> /month</span>
              </div>
              <span className='bg-success/10 text-success inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium'>
                <Building2 className='size-3.5' aria-hidden='true' />
                {subscription.plan.max_properties} max properties
              </span>
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
                      ? formatDateAndTime(subscription.start_date)
                      : 'N/A'}
                  </dd>
                </div>
                <div className='flex items-center justify-between'>
                  <dt className='text-muted-foreground'>End date</dt>
                  <dd className='font-medium'>
                    {subscription.end_date
                      ? formatDateAndTime(subscription.end_date)
                      : 'N/A'}
                  </dd>
                </div>
                <div className='flex items-center justify-between'>
                  <dt className='text-muted-foreground'>Next billing</dt>
                  <dd className='font-medium'>
                    {subscription.next_billing_date
                      ? formatDateAndTime(subscription.next_billing_date)
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

      {/* Pending plan change */}
      {subscription.pending_plan && (
        <div
          className={cn(
            "border-primary/20 from-primary/5 relative overflow-hidden rounded-2xl border bg-linear-to-r via-white to-white p-6 before:absolute before:top-0 before:left-0 before:h-full before:w-1 before:content-[''] dark:via-white/4 dark:to-white/4",
            planTierAccent[subscription.pending_plan.plan_type] ??
              'before:bg-primary',
          )}
        >
          <div className='flex flex-wrap items-center justify-between gap-4'>
            <div className='flex items-center gap-3'>
              <span className='bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-full'>
                <CalendarClock className='size-4.5' aria-hidden='true' />
              </span>
              <div>
                <div className='flex items-center gap-2'>
                  <span className='text-sm font-semibold'>
                    Upcoming plan change
                  </span>
                  <span className='bg-primary/10 text-primary rounded-full px-2 py-0.5 text-[11px] font-medium'>
                    Scheduled
                  </span>
                </div>
                <p className='text-muted-foreground mt-0.5 text-xs'>
                  Takes effect on{' '}
                  <span className='text-foreground font-medium'>
                    {formatDateAndTime(
                      subscription.pending_plan.effective_date,
                    )}
                  </span>
                </p>
              </div>
            </div>

            <div className='flex items-center gap-3 sm:gap-5'>
              <div className='flex items-center gap-2 text-sm'>
                <span className='text-muted-foreground'>
                  {subscription.plan.name}
                </span>
                <ArrowRight
                  className='text-muted-foreground size-3.5'
                  aria-hidden='true'
                />
                <span className='font-semibold'>
                  {subscription.pending_plan.name}
                </span>
              </div>

              <div className='bg-border/70 h-8 w-px' />

              <div className='text-right'>
                <span className='text-xl font-semibold tracking-[-0.02em]'>
                  ${Number(subscription.pending_plan.monthly_price).toFixed(2)}
                </span>
                <span className='text-muted-foreground text-sm'>/month</span>
              </div>

              <span className='bg-success/10 text-success inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium'>
                <Building2 className='size-3.5' aria-hidden='true' />
                {subscription.pending_plan.max_properties} max properties
              </span>
            </div>
          </div>

          <div className='mt-5'>
            <div className='bg-primary/10 relative h-2 w-full overflow-hidden rounded-full'>
              <div
                className='bg-primary absolute inset-y-0 left-0 rounded-full transition-[width] duration-1000 ease-out'
                style={{
                  width: `${getElapsedPercent(
                    subscription.start_date,
                    subscription.pending_plan.effective_date,
                  )}%`,
                }}
              >
                <div className='animate-shimmer absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/50 to-transparent dark:via-white/20' />
              </div>
            </div>
            <div className='text-muted-foreground mt-1.5 flex items-center justify-between text-[11px]'>
              <span>{formatDateAndTime(subscription.start_date)}</span>
              <span>
                {formatDateAndTime(subscription.pending_plan.effective_date)}
              </span>
            </div>
          </div>

          <div className='mt-5 flex items-center justify-end gap-3'>
            <Button
              variant='destructive'
              size='sm'
              onClick={() => setIsRemoveDialogOpen(true)}
            >
              <X />
              Remove Plan
            </Button>
          </div>
        </div>
      )}

      <RemovePendingPlanDialog
        open={isRemoveDialogOpen}
        pendingPlan={subscription.pending_plan}
        currentPlanName={subscription.plan.name}
        onOpenChange={setIsRemoveDialogOpen}
        onConfirm={handleRemovePendingPlan}
        isRemovePending={isRemovePending}
      />

      {/* Plan features */}
      {subscription.plan.features && subscription.plan.features.length > 0 && (
        <div className='border-border/70 rounded-2xl border bg-white p-6 dark:bg-white/4'>
          <div className='mb-4 flex items-center gap-2'>
            <Sparkles className='text-success size-4' aria-hidden='true' />
            <span className='text-sm font-semibold'>Current Plan features</span>
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
