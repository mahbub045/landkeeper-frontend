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
      <span className='text-muted-foreground inline-flex items-center gap-1.5'>
        <X className='size-4' aria-hidden='true' />
        Not included
      </span>
    );
  }

  if (feature.value) return <span>{feature.value}</span>;

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

  const rowClass = (index: number) =>
    index % 2 === 1 && 'bg-muted/40 dark:bg-white/[0.02]';

  return (
    <div className='-mx-4 overflow-x-auto px-4 pt-4 pb-2'>
      <table className='w-full min-w-180 border-separate border-spacing-x-3 border-spacing-y-0 text-sm'>
        <thead>
          <tr>
            <th className='w-[28%]' aria-label='Feature' />
            {plans.map((plan) => {
              const meta = getPlanMeta(plan);
              const isPopular = plan.plan_type === 'STANDARD';

              return (
                <th
                  key={plan.alias}
                  scope='col'
                  className={cn(
                    'relative rounded-t-2xl px-4 pt-6 pb-4 text-center font-normal',
                    meta.header,
                  )}
                >
                  {isPopular && (
                    <span className='bg-background absolute -top-3 left-1/2 -translate-x-1/2 rounded-full border border-violet-300 px-3 py-0.5 text-xs font-semibold whitespace-nowrap text-violet-700 dark:border-violet-400/40 dark:text-violet-300'>
                      Most popular
                    </span>
                  )}
                  <p className='text-lg font-semibold'>{plan.name}</p>
                  <p className='mt-1'>
                    <span className='text-2xl font-semibold tracking-tight'>
                      {getCurrencySign()}
                      {Number(
                        plan.discounted_price ?? plan.monthly_price,
                      ).toFixed(2)}
                    </span>
                    <span className='text-xs opacity-80'> / month</span>
                  </p>
                  {plan.discounted_price && (
                    <p className='mt-0.5 text-xs line-through opacity-70'>
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
          {limitRows.map((row, index) => (
            <tr key={row.key}>
              <th
                scope='row'
                className={cn(
                  'rounded-l-lg px-3 py-2.5 text-left font-medium',
                  rowClass(index),
                )}
              >
                {row.name}
              </th>
              {plans.map((plan) => {
                const meta = getPlanMeta(plan);
                const limit = row.getLimit(plan);
                const Icon = row.icon;

                return (
                  <td
                    key={plan.alias}
                    className={cn('px-3 py-2', rowClass(index), meta.column)}
                  >
                    <div className='border-border/70 bg-background/60 flex items-center justify-between gap-3 rounded-xl border px-3 py-2 backdrop-blur-sm'>
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
                      <p className='text-foreground text-base font-semibold tabular-nums'>
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
                  </td>
                );
              })}
            </tr>
          ))}

          {featureRows.map((row, rowIndex) => {
            const index = rowIndex + limitRows.length;

            return (
              <tr key={row.code}>
                <th
                  scope='row'
                  title={row.description}
                  className={cn(
                    'rounded-l-lg px-3 py-2.5 text-left font-medium',
                    rowClass(index),
                  )}
                >
                  {row.name}
                </th>
                {plans.map((plan) => {
                  const feature = plan.features.find(
                    (f) => f.code === row.code,
                  );

                  return (
                    <td
                      key={plan.alias}
                      className={cn(
                        'px-4 py-2.5 text-center',
                        rowClass(index),
                        getPlanMeta(plan).column,
                        !feature?.is_included &&
                          'bg-rose-50/70 dark:bg-rose-500/6',
                      )}
                    >
                      <FeatureCell feature={feature} />
                    </td>
                  );
                })}
              </tr>
            );
          })}

          <tr>
            <td />
            {plans.map((plan) => {
              const isPopular = plan.plan_type === 'STANDARD';

              return (
                <td
                  key={plan.alias}
                  className={cn(
                    'rounded-b-2xl px-4 pt-3 pb-4',
                    getPlanMeta(plan).column,
                    isPopular && 'border-b',
                  )}
                >
                  <Button
                    type='button'
                    variant={isPopular ? 'default' : 'outline'}
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
                        {plan.current_plan
                          ? 'Current plan'
                          : `Choose ${plan.name}`}
                        {!plan.current_plan && (
                          <ArrowRight data-icon='inline-end' />
                        )}
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
  );
};

export default PricingPlansComparisonTable;
