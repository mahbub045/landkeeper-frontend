'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { pricingPlanMeta } from '@/data/client/Landlord/BillingAndPlans/PricingPlanData';
import { cn } from '@/lib/utils';
import {
  useGetPricingPlansQuery,
  useSelectPricingPlanMutation,
} from '@/store/api/endpoints/client/Landlord/BillingAndPlans/PricingPlans/PricingPlansApi';
import {
  PricingPlan,
  SelectPricingPlanResponse,
} from '@/types/client/Landlord/BillingAndPlans/PricingPlansType';
import { getCurrencySign } from '@/utils/formatters';
import { ArrowRight, Check, LoaderCircle, TriangleAlert } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { toast } from 'sonner';
import PricingPlanPaymentDialog from './PricingPlanPaymentDialog';
import PricingPlansCardSkeleton from './PricingPlansCardSkeleton';

const PricingPlansCard: React.FC = () => {
  const { update } = useSession();
  const [selectPricingPlan, { isLoading: isSelectingPlan }] =
    useSelectPricingPlanMutation();
  const [selectedPlanType, setSelectedPlanType] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
  const [pendingPayment, setPendingPayment] = useState<Pick<
    SelectPricingPlanResponse,
    'client_secret' | 'mode'
  > | null>(null);
  const [expandedPlans, setExpandedPlans] = useState<Record<string, boolean>>(
    {},
  );
  const [downgradePlan, setDowngradePlan] = useState<PricingPlan | null>(null);

  const {
    data: pricingPlans,
    isLoading,
    isError,
  } = useGetPricingPlansQuery(undefined);

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

  // Hits /subscription/plans/select. If the backend returns a client_secret,
  // a payment/setup confirmation is required, so we open the Stripe dialog
  // to collect a card. If it doesn't (e.g. a downgrade/upgrade with nothing
  // due now), the plan change is already complete and no Stripe UI is needed.
  const handleSelectPlan = async (plan: PricingPlan) => {
    setSelectedPlanType(plan.alias);

    try {
      const response = await selectPricingPlan({
        payload: {
          plan_id: plan.alias,
        },
      }).unwrap();

      if (!response?.client_secret) {
        let successMessage = response?.message;

        if (!successMessage) {
          const currentPlan = pricingPlans?.results?.find(
            (p: PricingPlan) => p.current_plan,
          );
          const isUpgrade =
            currentPlan &&
            Number(plan.monthly_price) > Number(currentPlan.monthly_price);
          const isDowngrade =
            currentPlan &&
            Number(plan.monthly_price) < Number(currentPlan.monthly_price);

          successMessage = isUpgrade
            ? 'Plan upgraded successfully!'
            : isDowngrade
              ? 'Plan will change on your next billing cycle.'
              : 'Plan updated successfully!';
        }

        await handlePaymentConfirmed(`${successMessage} Redirecting...`);
        return;
      }

      // Payment/setup confirmation is required — open the Stripe dialog with
      // the secret we already have so CardPaymentForm doesn't have to ask
      // the backend again.
      setPendingPayment({
        client_secret: response.client_secret,
        mode: response.mode,
      });
      setSelectedPlan(plan);
    } catch (error: unknown) {
      console.error('Failed to select plan:', error);
      toast.error(
        getErrorMessage(error, 'Could not change plan. Please try again.'),
      );
      setSelectedPlanType(null);
    }
  };

  // Step A: called from CardPaymentForm once Stripe has created a
  // PaymentMethod. Returns the client_secret obtained by handleSelectPlan so
  // CardPaymentForm can confirm the card payment.
  // NOTE: this does NOT mean the subscription is active yet — that only
  // happens once Stripe confirms the PaymentIntent (see handlePaymentConfirmed).
  const handlePaymentMethod = async (
    paymentMethodId: string,
  ): Promise<{ clientSecret: string; mode?: 'payment' | 'setup' }> => {
    if (!selectedPlan || !pendingPayment?.client_secret) {
      throw new Error('No plan selected.');
    }

    return {
      clientSecret: pendingPayment.client_secret,
      mode: pendingPayment.mode,
    };
  };

  // Step B: called once the plan change is actually finalized — either
  // Stripe has confirmed the PaymentIntent, or no payment confirmation was
  // needed at all (e.g. a downgrade/upgrade with nothing due now).
  const handlePaymentConfirmed = async (
    successMessage = 'Subscription started successfully! Redirecting...',
  ) => {
    try {
      // Sync has_subscription into the JWT/session so any subscription-gated
      // pages, layouts, or middleware see the up-to-date value immediately.
      await update({ has_subscription: true });
    } catch (error) {
      // Don't let a session-sync failure block the redirect — the payment
      // already succeeded at this point. Log it and continue.
      console.error('Failed to sync session after payment:', error);
    }

    toast.success(successMessage);
    setSelectedPlan(null);
    setSelectedPlanType(null);
    setPendingPayment(null);

    // Give the toast a moment to render before the full-page navigation
    // unmounts everything.
    setTimeout(() => {
      window.location.href = '/client/landlord/billing-and-plans/billing';
    }, 1500);
  };

  const toggleFeatures = (alias: string) => {
    setExpandedPlans((prev) => ({ ...prev, [alias]: !prev[alias] }));
  };

  const isDowngradePlan = (plan: PricingPlan) => {
    const currentPlan = pricingPlans?.results?.find(
      (p: PricingPlan) => p.current_plan,
    );
    return Boolean(
      currentPlan &&
      Number(plan.monthly_price) < Number(currentPlan.monthly_price),
    );
  };

  const onChoosePlan = (plan: PricingPlan) => {
    if (isDowngradePlan(plan)) {
      setDowngradePlan(plan);
      return;
    }
    handleSelectPlan(plan);
  };

  const confirmDowngrade = () => {
    if (!downgradePlan) return;
    const plan = downgradePlan;
    setDowngradePlan(null);
    handleSelectPlan(plan);
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
                  onClick={() => onChoosePlan(plan)}
                >
                  {isSelectingPlan && selectedPlanType === plan.alias ? (
                    <>
                      <LoaderCircle className='animate-spin' />
                      Processing...
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
      <AlertDialog
        open={!!downgradePlan}
        onOpenChange={(open) => {
          if (!open) setDowngradePlan(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogMedia className='bg-danger/10 text-danger'>
              <TriangleAlert aria-hidden='true' />
            </AlertDialogMedia>
            <AlertDialogTitle>Confirm plan downgrade</AlertDialogTitle>
            <AlertDialogDescription>
              This change takes effect on your{' '}
              <span className='text-foreground font-semibold'>
                next billing cycle
              </span>
              .
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className='flex items-center justify-center gap-3 py-1 text-sm font-medium'>
            <span className='text-muted-foreground rounded-full border px-3 py-1'>
              {
                pricingPlans?.results?.find((p: PricingPlan) => p.current_plan)
                  ?.name
              }
            </span>
            <ArrowRight
              className='text-muted-foreground size-4 shrink-0'
              aria-hidden='true'
            />
            <span className='bg-primary/10 text-primary rounded-full px-3 py-1'>
              {downgradePlan?.name}
            </span>
          </div>

          <div className='border-danger/20 bg-danger/10 text-danger rounded-lg border p-3 text-sm'>
            You&apos;ll keep your current plan and its benefits until the end of
            this billing cycle. The new plan starts on your next billing date.
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDowngradePlan(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmDowngrade}>
              Agreed
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <PricingPlanPaymentDialog
        selectedPlan={selectedPlan}
        onOpenChange={(open) => {
          if (!open && !isSelectingPlan) {
            setSelectedPlan(null);
            setSelectedPlanType(null);
            setPendingPayment(null);
          }
        }}
        onPaymentMethod={handlePaymentMethod}
        onConfirmed={() => handlePaymentConfirmed()}
        onCancel={() => {
          setSelectedPlan(null);
          setSelectedPlanType(null);
          setPendingPayment(null);
        }}
      />
    </>
  );
};

export default PricingPlansCard;
