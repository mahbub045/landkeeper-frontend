'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  useCheckCouponValidityMutation,
  useGetPricingPlansQuery,
  useSelectPricingPlanMutation,
} from '@/store/api/endpoints/client/Landlord/BillingAndPlans/PricingPlans/PricingPlansApi';
import { SelectPricingPlanResponse } from '@/types/client/Landlord/BillingAndPlans/PricingPlansType';
import { PricingPlan } from '@/types/common/PricingPlans/PricingPlansType';
import { getCurrencySign } from '@/utils/formatters';
import { ArrowRight, Building2, Check, LoaderCircle, Tag } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { toast } from 'sonner';
import PricingPlanDowngradeDialog from './Dialogs/PricingPlanDowngradeDialog';
import PricingPlanPaymentDialog from './Dialogs/PricingPlanPaymentDialog';
import PricingPlansCardSkeleton from '@/components/common/PricingPlans/PricingPlansCardSkeleton';
import PricingPlansComparisonTable from '@/components/common/PricingPlans/PricingPlansComparisonTable';

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
  const [downgradePlan, setDowngradePlan] = useState<PricingPlan | null>(null);

  // Coupon state: `couponInput` is what the user is typing,
  // `appliedCoupon` is what is actually sent to the API as a query param.
  // `null` means the user hasn't touched the field yet, so it shows the
  // coupon from the API (if any) instead of an empty string.
  const [couponInput, setCouponInput] = useState<string | null>(null);
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [couponError, setCouponError] = useState('');
  // Set when the user removes a coupon the API returned on its own, so we
  // don't keep re-filling the field from the plans response.
  const [couponDismissed, setCouponDismissed] = useState(false);

  // const { data: profileData } = useGetProfileInfoQuery(undefined);

  // // Only show the coupon field when the user has no subscription yet.
  // const showCouponField = profileData?.subscription_status === null;

  const [checkCouponValidity, { isLoading: isCheckingCoupon }] =
    useCheckCouponValidityMutation();

  const {
    data: pricingPlans,
    isLoading,
    isFetching,
    isError,
  } = useGetPricingPlansQuery(
    appliedCoupon ? { coupon_code: appliedCoupon } : undefined,
  );

  // If the plans response already carries a coupon_code (e.g. a referral
  // coupon attached to the user), treat it as applied and show it in the field.
  const planCoupon: string =
    pricingPlans?.results?.find((p: PricingPlan) => p.coupon_code)
      ?.coupon_code ?? '';

  // The coupon currently in effect: one the user applied, or one from the API.
  const activeCoupon = appliedCoupon || (couponDismissed ? '' : planCoupon);

  // What the input displays: the user's text, or the API coupon until they type.
  const inputValue = couponInput ?? activeCoupon;

  // Validate the coupon first. Only a valid coupon is stored in
  // `appliedCoupon`, which is what triggers the plans refetch with
  // ?coupon_code=... — so an invalid code never reaches the plans request.
  const applyCoupon = async () => {
    const code = inputValue.trim();
    if (!code) return;

    setCouponError('');

    try {
      const result = (await checkCouponValidity({
        coupon_code: code,
      }).unwrap()) as { valid?: boolean; is_valid?: boolean } | undefined;

      // A 2xx response means valid. If your backend returns an explicit
      // flag instead, treat `false` as invalid.
      if (result?.valid === false || result?.is_valid === false) {
        setCouponError('This coupon code is invalid or has expired.');
        return;
      }

      setCouponDismissed(false);
      setAppliedCoupon(code);
    } catch (error: unknown) {
      setAppliedCoupon('');
      setCouponError(
        getErrorMessage(error, 'This coupon code is invalid or has expired.'),
      );
    }
  };

  const clearCoupon = () => {
    setCouponInput('');
    setAppliedCoupon('');
    setCouponError('');
    setCouponDismissed(true);
  };

  // True once the coupon in the input is the one currently applied.
  const isCouponApplied =
    Boolean(activeCoupon) && !isFetching && inputValue.trim() === activeCoupon;

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
          ...(activeCoupon ? { coupon_code: activeCoupon } : {}),
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
      {/* <PricingPlanCouponField
        inputValue={inputValue}
        activeCoupon={activeCoupon}
        couponError={couponError}
        isCouponApplied={isCouponApplied}
        isLoading={isFetching || isCheckingCoupon}
        onInputChange={(value) => {
          setCouponInput(value);
          if (couponError) setCouponError('');
        }}
        onApply={applyCoupon}
        onClear={clearCoupon}
      /> */}

      <PricingPlansComparisonTable
        plans={pricingPlans.results}
        selection={{ isSelectingPlan, selectedPlanType, onChoosePlan }}
      />
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
