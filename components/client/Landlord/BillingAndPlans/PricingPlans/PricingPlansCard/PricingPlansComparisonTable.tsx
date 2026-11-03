'use client';

import { Button } from '@/components/ui/button';
import { pricingPlanMeta } from '@/data/client/Landlord/BillingAndPlans/PricingPlanData';
import { cn } from '@/lib/utils';
import {
  PricingPlan,
  PricingPlanFeature,
  PricingPlansComparisonTableProps,
} from '@/types/client/Landlord/BillingAndPlans/PricingPlansType';
import { getCurrencySign } from '@/utils/formatters';
import {
  ArrowRight,
  Building2,
  Check,
  CircleCheck,
  LoaderCircle,
  Users,
  X,
} from 'lucide-react';

const getPlanMeta = (plan: PricingPlan) =>
  pricingPlanMeta[plan.plan_type as keyof typeof pricingPlanMeta] ??
  pricingPlanMeta.BASIC;

// A feature with a `value` shows that text; otherwise a tick or "Not included".
const FeatureCell = ({ feature }: { feature?: PricingPlanFeature }) => {
  if (!feature || !feature.is_included) {
    return (
      <span className='text-muted-foreground/80 inline-flex items-center gap-1.5 text-xs'>
        <span className='flex size-4 items-center justify-center rounded-full bg-rose-100 text-rose-500 dark:bg-rose-500/15 dark:text-rose-400'>
          <X className='size-3' strokeWidth={3} aria-hidden='true' />
        </span>
        Not included
      </span>
    );
  }

  if (feature.value) {
    return <span className='text-foreground font-medium'>{feature.value}</span>;
  }

  return (
    <CircleCheck
      className='mx-auto size-5 fill-emerald-500 text-white dark:text-emerald-950'
      aria-label='Included'
    />
  );
};

const PricingPlansComparisonTable: React.FC<
  PricingPlansComparisonTableProps
> = ({ plans, isSelectingPlan, selectedPlanType, onChoosePlan }) => {
  // Rows follow the first plan's feature order; any feature that only exists
  // on a later plan is appended so nothing is dropped.
  const featureRows = plans
    .flatMap((plan) => plan.features)
    .filter(
      (feature, index, all) =>
        all.findIndex((f) => f.code === feature.code) === index,
    );

  // `null` means the plan has no limit.
  const limitRows = [
    {
      key: 'properties',
      name: 'Properties',
      icon: Building2,
      getLimit: (plan: PricingPlan) => plan.max_properties,
    },
    {
      key: 'users',
      name: 'Users',
      icon: Users,
      getLimit: (plan: PricingPlan) => plan.max_users,
    },
  ];

  return (
    <div className='bg-card/80 rounded-3xl border p-3 shadow-sm backdrop-blur-sm sm:p-5'>
      <div className='-mx-3 overflow-x-auto px-3 pt-4 sm:-mx-5 sm:px-5'>
        <table className='w-full min-w-180 border-separate border-spacing-x-3 border-spacing-y-0 text-sm'>
          <thead>
            <tr>
              <th className='w-[28%] px-3 pb-4 text-left align-bottom'>
                <p className='text-muted-foreground text-xs font-semibold tracking-[0.16em] uppercase'>
                  Compare plans
                </p>
                <p className='mt-1 text-lg font-semibold tracking-tight'>
                  Features
                </p>
              </th>
              {plans.map((plan) => {
                const meta = getPlanMeta(plan);
                const isPopular = plan.plan_type === 'STANDARD';

                return (
                  <th
                    key={plan.alias}
                    scope='col'
                    className={cn(
                      'relative rounded-t-2xl px-4 pt-6 pb-5 text-center font-normal',
                      meta.header,
                    )}
                  >
                    {isPopular && (
                      <span className='absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-violet-500 px-3 py-1 text-[11px] font-semibold whitespace-nowrap text-white shadow-sm ring-2 ring-white dark:ring-violet-950'>
                        Recommended
                      </span>
                    )}
                    <p className='text-[11px] font-semibold tracking-[0.16em] uppercase opacity-70'>
                      {meta.eyebrow}
                    </p>
                    <p className='mt-1 text-xl font-semibold tracking-tight'>
                      {plan.name}
                    </p>
                    <p className='mt-2 flex items-baseline justify-center gap-1'>
                      <span className='text-3xl font-semibold tracking-[-0.04em]'>
                        {getCurrencySign()}
                        {Number(
                          plan.discounted_price ?? plan.monthly_price,
                        ).toFixed(2)}
                      </span>
                      <span className='text-xs opacity-75'>/ month</span>
                    </p>
                    {plan.discounted_price && (
                      <p className='mt-0.5 text-xs line-through opacity-60'>
                        {getCurrencySign()}
                        {Number(plan.monthly_price).toFixed(2)}
                      </p>
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            <tr>
              <td aria-hidden='true' />
              {plans.map((plan) => {
                const meta = getPlanMeta(plan);

                return (
                  <td
                    key={plan.alias}
                    className={cn('px-3 pt-3 pb-4', meta.column)}
                  >
                    <div className='border-border/70 bg-background/70 divide-border/70 divide-y rounded-xl border shadow-xs'>
                      {limitRows.map((row) => {
                        const limit = row.getLimit(plan);
                        const Icon = row.icon;

                        return (
                          <div
                            key={row.key}
                            className='flex items-center justify-between gap-3 px-3 py-2'
                          >
                            <div className='flex items-center gap-2.5'>
                              <div
                                className={cn(
                                  'flex size-8 items-center justify-center rounded-lg',
                                  meta.iconTile,
                                )}
                              >
                                <Icon className='size-4' aria-hidden='true' />
                              </div>
                              <span className='text-muted-foreground text-sm font-medium'>
                                {row.name}
                              </span>
                            </div>
                            <p className='text-foreground text-base font-semibold whitespace-nowrap tabular-nums'>
                              {limit === null ? (
                                'Unlimited'
                              ) : (
                                <>
                                  <span className='text-muted-foreground mr-1.5 text-xs font-medium'>
                                    Up to
                                  </span>
                                  {limit}
                                </>
                              )}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </td>
                );
              })}
            </tr>

            {featureRows.map((row) => (
              <tr key={row.code} className='group'>
                <th
                  scope='row'
                  title={row.description}
                  className='border-border/60 group-hover:bg-muted/50 border-t px-3 py-3 text-left font-medium transition-colors'
                >
                  {row.name}
                </th>
                {plans.map((plan) => {
                  const meta = getPlanMeta(plan);
                  const feature = plan.features.find(
                    (f) => f.code === row.code,
                  );

                  return (
                    <td
                      key={plan.alias}
                      className={cn(
                        'border-t px-4 py-3 text-center transition-colors',
                        meta.column,
                        'border-t-border/60',
                        meta.rowHover,
                      )}
                    >
                      <FeatureCell feature={feature} />
                    </td>
                  );
                })}
              </tr>
            ))}

            <tr>
              <td />
              {plans.map((plan) => {
                const meta = getPlanMeta(plan);
                const isPopular = plan.plan_type === 'STANDARD';

                return (
                  <td
                    key={plan.alias}
                    className={cn(
                      'rounded-b-2xl border-t border-b px-4 pt-4 pb-5',
                      meta.column,
                      'border-t-border/60',
                    )}
                  >
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
                      ) : plan.current_plan ? (
                        <>
                          <Check data-icon='inline-start' />
                          Current plan
                        </>
                      ) : (
                        <>
                          Choose {plan.name}
                          <ArrowRight data-icon='inline-end' />
                        </>
                      )}
                    </Button>
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PricingPlansComparisonTable;
