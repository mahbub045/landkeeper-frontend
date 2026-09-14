'use client';

import { Button } from '@/components/ui/button';
import { pricingPlanMeta } from '@/data/client/Landlord/BillingAndPlans/PricingPlanData';
import { cn } from '@/lib/utils';
import {
  useGetPricingPlansQuery,
  useSelectPricingPlanMutation,
} from '@/store/api/endpoints/client/Landlord/BillingAndPlans/PricingPlans/PricingPlansApi';
import { PricingPlan } from '@/types/client/Landlord/BillingAndPlans/PricingPlansType';
import { getCurrencySign } from '@/utils/formatters';
import { ArrowRight, Check, LoaderCircle } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import PricingPlanPaymentDialog from './PricingPlanPaymentDialog';
import PricingPlansCardSkeleton from './PricingPlansCardSkeleton';

const PricingPlansCard: React.FC = () => {
  const { update } = useSession();
  const router = useRouter();
  const [selectPricingPlan, { isLoading: isSelectingPlan }] =
    useSelectPricingPlanMutation();
  const [selectedPlanType, setSelectedPlanType] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
  const [expandedPlans, setExpandedPlans] = useState<Record<string, boolean>>(
    {},
  );

  const {
    data: pricingPlans,
    isLoading,
    isError,
  } = useGetPricingPlansQuery(undefined);

  const handleSelectPlan = async (plan: PricingPlan) => {
    setSelectedPlan(plan);
  };

  // Step A: hits /subscription/plans/select. The backend creates the
  // subscription in an "incomplete" state and returns a PaymentIntent
  // client_secret, which CardPaymentForm uses to confirm the card payment.
  // NOTE: this does NOT mean the subscription is active yet — that only
  // happens once Stripe confirms the PaymentIntent (see handlePaymentConfirmed).
  const handlePaymentMethod = async (
    paymentMethodId: string,
  ): Promise<{ clientSecret: string }> => {
    if (!selectedPlan) {
      throw new Error('No plan selected.');
    }

    setSelectedPlanType(selectedPlan.alias);

    try {
      const response = await selectPricingPlan({
        payload: {
          plan_id: selectedPlan.alias,
        },
      }).unwrap();

      if (!response?.client_secret) {
        throw new Error('Could not start payment. Please try again.');
      }

      return { clientSecret: response.client_secret };
    } catch (error: unknown) {
      console.error('Failed to start subscription payment:', error);

      const errorData =
        error && typeof error === 'object' && 'data' in error
          ? (error as { data?: unknown }).data
          : null;
      const errorMessage =
        errorData && typeof errorData === 'object'
          ? (errorData as { detail?: string; message?: string }).detail ||
            (errorData as { detail?: string; message?: string }).message
          : null;

      const message =
        errorMessage ||
        (error instanceof Error ? error.message : null) ||
        'Could not start payment. Please try again.';

      toast.error(message);
      setSelectedPlanType(null);
      throw new Error(message);
    }
  };

  // Step B: only called once Stripe has actually confirmed the PaymentIntent.
  const handlePaymentConfirmed = async () => {
    try {
      // Sync has_subscription into the JWT/session so any subscription-gated
      // pages, layouts, or middleware see the up-to-date value immediately.
      await update({ has_subscription: true });
    } catch (error) {
      // Don't let a session-sync failure block the redirect — the payment
      // already succeeded at this point. Log it and continue.
      console.error('Failed to sync session after payment:', error);
    }

    toast.success('Subscription started successfully! Redirecting...');
    setSelectedPlan(null);
    setSelectedPlanType(null);

    router.push('/client/landlord/billing-and-plans/billing');
    router.refresh(); // re-renders server components (e.g. layout checks) with fresh session
  };

  const toggleFeatures = (alias: string) => {
    setExpandedPlans((prev) => ({ ...prev, [alias]: !prev[alias] }));
  };

  if (isLoading) {
    return <PricingPlansCardSkeleton />;
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
      <div className='grid items-start gap-5 lg:grid-cols-3'>
        {pricingPlans.results.map((plan: PricingPlan) => {
          const meta =
            pricingPlanMeta[plan.plan_type as keyof typeof pricingPlanMeta] ??
            pricingPlanMeta.BASIC;
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
                  <>
                    <Button
                      variant='link'
                      onClick={() => toggleFeatures(plan.alias)}
                      className='mt-1 pl-6 text-xs'
                      aria-expanded={!!expandedPlans[plan.alias]}
                    >
                      {expandedPlans[plan.alias]
                        ? 'Show less'
                        : `+ ${remainingFeatures} more feature${remainingFeatures === 1 ? '' : 's'}`}
                    </Button>

                    {expandedPlans[plan.alias] && (
                      <ul className='mt-3 max-h-32 space-y-3 overflow-y-auto pr-1'>
                        {plan.features.slice(7).map((feature) => (
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
                    )}
                  </>
                )}
              </div>
              <div className='mt-3'>
                <Button
                  type='button'
                  variant={isPopular ? 'default' : 'outline'}
                  size='lg'
                  className='w-full'
                  disabled={isSelectingPlan || plan.current_plan === true}
                  onClick={() => handleSelectPlan(plan)}
                >
                  {isSelectingPlan && selectedPlanType === plan.alias ? (
                    <>
                      <LoaderCircle className='animate-spin' />
                      Opening checkout...
                    </>
                  ) : (
                    <>
                      {plan?.current_plan ? 'Current plan' : 'Choose'}{' '}
                      {plan.name}
                      <ArrowRight data-icon='inline-end' />
                    </>
                  )}
                </Button>
              </div>
            </article>
          );
        })}
      </div>
      <PricingPlanPaymentDialog
        selectedPlan={selectedPlan}
        onOpenChange={(open) => {
          if (!open && !isSelectingPlan) {
            setSelectedPlan(null);
            setSelectedPlanType(null);
          }
        }}
        onPaymentMethod={handlePaymentMethod}
        onConfirmed={handlePaymentConfirmed}
        onCancel={() => {
          setSelectedPlan(null);
          setSelectedPlanType(null);
        }}
      />
    </>
  );
};

export default PricingPlansCard;
