'use client';

import { Package } from 'lucide-react';

import CustomErrorMessage from '@/components/common/CustomErrorMessage/CustomErrorMessage';
import { useGetPricingPlansQuery } from '@/store/api/endpoints/client/Landlord/BillingAndPlans/PricingPlans/PricingPlansApi';
import PricingPlanCard from './PricingPlanCard';
import PricingPlanCardSkeleton from './PricingPlanCardSkeleton';

const PricingPlanList: React.FC = () => {
  const {
    data: pricingPlans,
    isLoading,
    isError,
  } = useGetPricingPlansQuery(undefined);

  const plans = pricingPlans?.results ?? [];

  return (
    <div className='space-y-6'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
        <div>
          <h1 className='text-foreground flex items-center gap-2 text-2xl font-bold tracking-tight'>
            <Package className='text-primary h-6 w-6' />
            Pricing Plans
          </h1>
          <p className='text-muted-foreground text-sm'>
            Subscription plans offered to landlords, with their limits and
            included features.
          </p>
        </div>
      </div>

      {isError ? (
        <CustomErrorMessage title='pricing plans' />
      ) : isLoading ? (
        <div className='grid gap-5 md:grid-cols-2 xl:grid-cols-3'>
          {Array.from({ length: 3 }).map((_, i) => (
            <PricingPlanCardSkeleton key={i} />
          ))}
        </div>
      ) : plans.length === 0 ? (
        <div className='border-border flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed py-16 text-center'>
          <Package className='text-muted-foreground size-8' />
          <p className='text-muted-foreground text-sm'>
            No pricing plans found.
          </p>
        </div>
      ) : (
        <div className='grid items-stretch gap-5 md:grid-cols-2 xl:grid-cols-3'>
          {plans.map((plan) => (
            <PricingPlanCard key={plan.alias} plan={plan} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PricingPlanList;
