'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  useGetPricingPlansQuery,
  useSelectPricingPlanMutation,
} from '@/store/api/endpoints/client/Landlord/BillingAndPlans/PricingPlans/PricingPlansApi';
import { PricingPlan } from '@/types/client/Landlord/BillingAndPlans/PricingPlansType';
import { getCurrencySign } from '@/utils/formatters';
import {
  ArrowRight,
  Check,
  Crown,
  Gem,
  LoaderCircle,
  Sparkles,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import PricingPlanPaymentDialog from './PricingPlanPaymentDialog';

const planMeta = {
  BASIC: {
    eyebrow: 'A focused start',
    accent:
      'border-slate-200 bg-white dark:border-white/10 dark:bg-white/[0.04]',
    icon: Sparkles,
  },
  STANDARD: {
    eyebrow: 'Most popular',
    accent:
      'border-primary/50 bg-primary/[0.04] shadow-[0_18px_60px_-30px_var(--primary)] dark:bg-primary/[0.08]',
    icon: Crown,
  },
  PREMIUM: {
    eyebrow: 'For serious portfolios',
    accent:
      'border-amber-300/80 bg-amber-50/70 dark:border-amber-300/30 dark:bg-amber-300/[0.08]',
    icon: Gem,
  },
} as const;

const PricingPlansCard: React.FC = () => {
  const router = useRouter();
  const [selectPricingPlan, { isLoading: isSelectingPlan }] =
    useSelectPricingPlanMutation();
  const [selectedPlanType, setSelectedPlanType] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
  const {
    data: pricingPlans,
    isLoading,
    isError,
  } = useGetPricingPlansQuery(undefined);

  const handleSelectPlan = async (plan: PricingPlan) => {
    setSelectedPlan(plan);
  };

  const handlePaymentMethod = async (paymentMethodId: string) => {
    if (!selectedPlan) return;

    setSelectedPlanType(selectedPlan.plan_type);

    try {
      const result = await selectPricingPlan({
        payload: {
          plan: selectedPlan.plan_type,
          payment_method_id: paymentMethodId,
        },
      }).unwrap();

      toast.success('Subscription started successfully! Redirecting...');
      router.push('/client/landlord/billing-and-plans/billing');
    } catch (error: unknown) {
      console.error('Failed to start subscription payment:', error);

      const errorData =
        error && typeof error === 'object' && 'data' in error
          ? error.data
          : null;
      const errorMessage =
        errorData && typeof errorData === 'object'
          ? (errorData as { detail?: string; message?: string }).detail ||
            (errorData as { detail?: string; message?: string }).message
          : null;

      toast.error(errorMessage || 'Could not start payment. Please try again.');
      setSelectedPlanType(null);
      throw new Error(errorMessage || 'Could not start payment.');
    }
  };

  if (isLoading) {
    return (
      <div className='grid items-start gap-5 lg:grid-cols-3'>
        {[0, 1, 2].map((item) => {
          const isPopular = item === 1;
          return (
            <div
              key={item}
              className={cn(
                'border-border/70 relative flex min-h-140 flex-col overflow-hidden rounded-2xl border bg-white p-6 dark:bg-white/4',
                isPopular && 'lg:-mt-3 lg:min-h-146 lg:p-7',
              )}
            >
              {isPopular && (
                <div className='bg-muted absolute inset-x-0 top-0 h-1 animate-pulse' />
              )}

              {/* icon + eyebrow + title */}
              <div className='flex items-start justify-between gap-4'>
                <div className='w-full'>
                  <div className='bg-muted mb-4 size-10 animate-pulse rounded-xl' />
                  <div className='bg-muted h-3 w-24 animate-pulse rounded' />
                  <div className='bg-muted mt-3 h-7 w-32 animate-pulse rounded' />
                </div>
                {isPopular && (
                  <div className='bg-muted h-6 w-24 shrink-0 animate-pulse rounded-full' />
                )}
              </div>

              {/* price */}
              <div className='mt-7 flex items-end gap-2'>
                <div className='bg-muted h-11 w-28 animate-pulse rounded' />
                <div className='bg-muted mb-2 h-4 w-12 animate-pulse rounded' />
              </div>

              {/* stats row */}
              <div className='border-border/70 mt-5 grid grid-cols-2 gap-2 border-y py-4 text-sm'>
                <div>
                  <div className='bg-muted h-3 w-20 animate-pulse rounded' />
                  <div className='bg-muted mt-2 h-4 w-24 animate-pulse rounded' />
                </div>
                <div>
                  <div className='bg-muted h-3 w-20 animate-pulse rounded' />
                  <div className='bg-muted mt-2 h-4 w-16 animate-pulse rounded' />
                </div>
              </div>

              {/* features */}
              <div className='mt-5 flex-1'>
                <div className='bg-muted h-4 w-36 animate-pulse rounded' />
                <ul className='mt-3 space-y-3'>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <li key={i} className='flex items-center gap-2.5'>
                      <div className='bg-muted size-4 shrink-0 animate-pulse rounded-full' />
                      <div
                        className='bg-muted h-3.5 animate-pulse rounded'
                        style={{ width: `${70 - i * 6}%` }}
                      />
                    </li>
                  ))}
                </ul>
              </div>

              {/* button */}
              <div className='bg-muted mt-9 h-11 w-full animate-pulse rounded-md' />
            </div>
          );
        })}
      </div>
    );
  }

  if (isError || !pricingPlans?.results?.length) {
    return (
      <div className='border-destructive/40 bg-destructive/5 rounded-2xl border border-dashed px-6 py-10 text-center'>
        <p className='font-medium'>
          Pricing plans are temporarily unavailable.
        </p>
        <p className='text-muted-foreground mt-1 text-sm'>
          Please refresh and try again.
        </p>
      </div>
    );
  }

  return (
    <>
      <PricingPlanPaymentDialog
        selectedPlan={selectedPlan}
        onOpenChange={(open) => {
          if (!open && !isSelectingPlan) {
            setSelectedPlan(null);
            setSelectedPlanType(null);
          }
        }}
        onPaymentMethod={handlePaymentMethod}
        onCancel={() => {
          setSelectedPlan(null);
          setSelectedPlanType(null);
        }}
      />

      <div className='grid items-start gap-5 lg:grid-cols-3'>
        {pricingPlans.results.map((plan: PricingPlan) => {
          const meta =
            planMeta[plan.plan_type as keyof typeof planMeta] ?? planMeta.BASIC;
          const Icon = meta.icon;
          const visibleFeatures = plan.features.slice(0, 7);
          const remainingFeatures =
            plan.features.length - visibleFeatures.length;
          const isPopular = plan.plan_type === 'STANDARD';

          return (
            <article
              key={plan.alias}
              className={cn(
                'relative flex min-h-140 flex-col overflow-hidden rounded-2xl border p-6 transition-transform duration-300 hover:-translate-y-1',
                meta.accent,
                isPopular && 'lg:-mt-3 lg:min-h-146 lg:p-7',
              )}
            >
              {isPopular && (
                <div className='bg-primary absolute inset-x-0 top-0 h-1' />
              )}

              <div className='flex items-start justify-between gap-4'>
                <div>
                  <div className='bg-foreground text-background mb-4 flex size-10 items-center justify-center rounded-xl'>
                    <Icon className='size-5' aria-hidden='true' />
                  </div>
                  <p className='text-muted-foreground text-xs font-semibold tracking-[0.16em] uppercase'>
                    {meta.eyebrow}
                  </p>
                  <h3 className='mt-2 text-2xl font-semibold tracking-tight'>
                    {plan.name}
                  </h3>
                </div>
                {isPopular && (
                  <span className='bg-primary text-primary-foreground rounded-full px-3 py-1 text-xs font-semibold'>
                    Recommended
                  </span>
                )}
              </div>

              <div className='mt-7 flex items-end gap-2'>
                <span className='text-5xl font-semibold tracking-[-0.04em]'>
                  {getCurrencySign()}
                  {Number(plan.monthly_price).toFixed(2)}
                </span>
                <span className='text-muted-foreground mb-2 text-sm'>
                  / month
                </span>
              </div>

              <div className='border-border/70 mt-5 grid grid-cols-2 gap-2 border-y py-4 text-sm'>
                <div>
                  <p className='text-muted-foreground'>Portfolio limit</p>
                  <p className='mt-1 font-semibold'>
                    {plan.max_properties} properties
                  </p>
                </div>
                <div>
                  <p className='text-muted-foreground'>Referral discount</p>
                  <p className='mt-1 font-semibold'>
                    {plan.referral_discount_percent}%
                  </p>
                </div>
              </div>

              <div className='mt-5 flex-1'>
                <p className='text-sm font-semibold'>Included in this plan</p>
                <ul className='mt-3 space-y-3'>
                  {visibleFeatures.map((feature) => (
                    <li
                      key={feature.code}
                      className='text-muted-foreground flex gap-2.5 text-sm'
                    >
                      <Check
                        className='text-primary mt-0.5 size-4 shrink-0'
                        aria-hidden='true'
                      />
                      <span>{feature.name}</span>
                    </li>
                  ))}
                </ul>
                {remainingFeatures > 0 && (
                  <p className='text-muted-foreground mt-3 pl-6 text-xs font-medium'>
                    + {remainingFeatures} more feature
                    {remainingFeatures === 1 ? '' : 's'}
                  </p>
                )}
              </div>
              <div className='mt-2'>
                <Button
                  type='button'
                  variant={isPopular ? 'default' : 'outline'}
                  size='lg'
                  className='mt-7 w-full'
                  disabled={isSelectingPlan}
                  onClick={() => handleSelectPlan(plan)}
                >
                  {isSelectingPlan && selectedPlanType === plan.plan_type ? (
                    <>
                      <LoaderCircle className='animate-spin' />
                      Opening checkout...
                    </>
                  ) : (
                    <>
                      Choose {plan.name}
                      <ArrowRight data-icon='inline-end' />
                    </>
                  )}
                </Button>
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
};

export default PricingPlansCard;
