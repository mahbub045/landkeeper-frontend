'use client';

import Loading from '@/components/common/CustomLoader/Loading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import {
  ArrowRight,
  Building2,
  Check,
  ListChecks,
  LoaderCircle,
  Tag,
  X,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { toast } from 'sonner';
import PricingPlanDowngradeDialog from './Dialogs/PricingPlanDowngradeDialog';
import PricingPlanPaymentDialog from './Dialogs/PricingPlanPaymentDialog';
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

  // Coupon state: `couponInput` is what the user is typing,
  // `appliedCoupon` is what is actually sent to the API as a query param.
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState('');

  // const { data: profileData } = useGetProfileInfoQuery(undefined);

  // // Only show the coupon field when the user has no subscription yet.
  // const showCouponField = profileData?.subscription_status === null;

  const {
    data: pricingPlans,
    isLoading,
    isFetching,
    isError,
  } = useGetPricingPlansQuery(
    appliedCoupon ? { coupon_code: appliedCoupon } : undefined,
  );

  const applyCoupon = () => {
    const code = couponInput.trim();
    if (!code) return;
    setAppliedCoupon(code);
  };

  const clearCoupon = () => {
    setCouponInput('');
    setAppliedCoupon('');
  };

  // True once the coupon in the input is the one currently applied.
  const isCouponApplied =
    Boolean(appliedCoupon) &&
    !isFetching &&
    couponInput.trim() === appliedCoupon;

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
          ...(appliedCoupon ? { coupon_code: appliedCoupon } : {}),
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

  // `isLoading` is only true on the very first load, so changing the coupon
  // keeps the existing cards on screen (RTK Query keeps old `data` while
  // `isFetching` is true) instead of flashing the skeleton.
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
        {appliedCoupon && (
          <Button variant='link' onClick={clearCoupon} className='mt-2'>
            Remove coupon and retry
          </Button>
        )}
      </div>
    );
  }

  return (
    <>
      <div className='mx-auto mb-8 flex w-full max-w-md flex-col gap-2'>
        <label htmlFor='coupon-code' className='text-sm font-medium'>
          Have a coupon code?
        </label>
        <form
          className='flex items-center gap-2'
          onSubmit={(e) => {
            e.preventDefault();
            applyCoupon();
          }}
        >
          <div className='relative flex-1'>
            <Tag
              className={cn(
                'absolute top-1/2 left-3.5 size-4 -translate-y-1/2 transition-colors',
                isCouponApplied ? 'text-green-600' : 'text-muted-foreground',
              )}
              aria-hidden='true'
            />
            <Input
              id='coupon-code'
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value)}
              placeholder='e.g. MDM-123456'
              autoComplete='off'
              disabled={isFetching}
              className={cn(
                'border-primary focus-visible:outline-primary h-11 rounded-xl pr-11 pl-10! font-medium tracking-wide shadow-xs transition-colors focus-visible:ring-0',
                isCouponApplied &&
                  'border-green-500/60 bg-green-500/5 focus-visible:ring-green-500/30',
              )}
            />
            {(couponInput || appliedCoupon) && !isFetching && (
              <button
                type='button'
                onClick={clearCoupon}
                aria-label='Remove coupon'
                className='text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:ring-ring absolute top-1/2 right-2 flex size-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full transition-colors focus-visible:ring-2 focus-visible:outline-none'
              >
                <X className='size-4' aria-hidden='true' />
              </button>
            )}
          </div>
          <Button
            type='submit'
            className='h-11 rounded-xl px-5'
            disabled={
              isFetching ||
              !couponInput.trim() ||
              couponInput.trim() === appliedCoupon
            }
          >
            {isFetching ? (
              <Loading className='text-white!' />
            ) : isCouponApplied ? (
              <Check />
            ) : null}
            {isCouponApplied ? 'Applied' : 'Apply Coupon'}
          </Button>
        </form>
        {isCouponApplied && (
          <p className='flex items-center gap-1.5 text-xs text-green-600'>
            <Check className='size-3.5' aria-hidden='true' />
            Coupon <span className='font-semibold'>{appliedCoupon}</span>{' '}
            applied. Discounted prices are shown below.
          </p>
        )}
      </div>

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
              <div className={cn('absolute inset-x-0 top-0 h-1', meta.bar)} />

              <div className='flex items-start justify-between gap-4'>
                <div>
                  <div
                    className={cn(
                      'mb-4 flex size-10 items-center justify-center rounded-xl',
                      meta.iconTile,
                    )}
                  >
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
                  <span className='rounded-full bg-violet-500 px-3 py-1 text-xs font-semibold text-white'>
                    Recommended
                  </span>
                )}
              </div>

              <div className='mt-7 flex items-end gap-2'>
                <span className='text-4xl font-semibold tracking-[-0.04em]'>
                  {getCurrencySign()}
                  {Number(plan.discounted_price ?? plan.monthly_price).toFixed(
                    2,
                  )}
                </span>
                {plan.discounted_price && (
                  <span className='text-muted-foreground mb-2 text-lg line-through'>
                    {getCurrencySign()}
                    {Number(plan.monthly_price).toFixed(2)}
                  </span>
                )}
                <span className='text-muted-foreground mb-2 text-sm'>
                  / month
                </span>
              </div>

              <div className='border-border/70 mt-5 grid grid-cols-2 divide-x divide-inherit rounded-xl border'>
                {[
                  {
                    label: 'Properties',
                    value: plan.max_properties,
                    icon: Building2,
                  },
                  {
                    label: 'Features',
                    value: plan.features.length,
                    icon: ListChecks,
                  },
                ].map((stat) => (
                  <div key={stat.label} className='px-3 py-2.5 text-center'>
                    <div className='text-muted-foreground flex items-center justify-center gap-1 text-[11px] font-medium tracking-wide uppercase'>
                      <stat.icon className='size-3' aria-hidden='true' />
                      {stat.label}
                    </div>
                    <p className='text-foreground mt-1 text-base font-semibold'>
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className='mt-5 flex-1'>
                <p className='text-sm font-semibold'>Included in this plan</p>
                <ul
                  className={cn(
                    'mt-3 space-y-3',
                    expandedPlans[plan.alias] &&
                      'max-h-52 overflow-y-auto pr-1',
                  )}
                >
                  {(expandedPlans[plan.alias]
                    ? plan.features
                    : visibleFeatures
                  ).map((feature) => (
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
      <PricingPlanDowngradeDialog
        currentPlanName={
          pricingPlans?.results?.find((p: PricingPlan) => p.current_plan)?.name
        }
        downgradePlan={downgradePlan}
        onOpenChange={(open) => {
          if (!open) setDowngradePlan(null);
        }}
        onConfirm={confirmDowngrade}
      />
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
