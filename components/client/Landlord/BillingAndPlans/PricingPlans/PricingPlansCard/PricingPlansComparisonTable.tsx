'use client';

import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { pricingPlanMeta } from '@/data/client/Landlord/BillingAndPlans/PricingPlanData';
import { cn } from '@/lib/utils';
import {
  PricingPlan,
  PricingPlanChooseButtonProps,
  PricingPlanFeatureCellProps,
  PricingPlanSectionProps,
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

const isPopularPlan = (plan: PricingPlan) => plan.plan_type === 'STANDARD';

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

// A feature with a `value` shows that text; otherwise a tick or "Not included".
const FeatureCell = ({ feature }: PricingPlanFeatureCellProps) => {
  if (!feature || !feature.is_included) {
    return (
      <span className='text-muted-foreground/80 inline-flex items-center gap-1.5 text-xs whitespace-nowrap'>
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
      className='size-5 fill-emerald-500 text-white dark:text-emerald-950'
      aria-label='Included'
    />
  );
};

const PlanHeading = ({ plan }: PricingPlanSectionProps) => {
  const meta = getPlanMeta(plan);

  return (
    <>
      {isPopularPlan(plan) && (
        <span className='absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-violet-500 px-3 py-1 text-[11px] font-semibold whitespace-nowrap text-white shadow-sm ring-2 ring-white dark:ring-violet-950'>
          Recommended
        </span>
      )}
      <p className='text-[11px] font-semibold tracking-[0.16em] uppercase opacity-70'>
        {meta.eyebrow}
      </p>
      <p className='mt-1 text-xl font-semibold tracking-tight'>{plan.name}</p>
      <p className='mt-2 flex items-baseline justify-center gap-1'>
        <span className='text-3xl font-semibold tracking-[-0.04em]'>
          {getCurrencySign()}
          {Number(plan.discounted_price ?? plan.monthly_price).toFixed(2)}
        </span>
        <span className='text-xs opacity-75'>/ month</span>
      </p>
      {plan.discounted_price && (
        <p className='mt-0.5 text-xs line-through opacity-60'>
          {getCurrencySign()}
          {Number(plan.monthly_price).toFixed(2)}
        </p>
      )}
    </>
  );
};

const PlanLimits = ({ plan }: PricingPlanSectionProps) => {
  const meta = getPlanMeta(plan);

  return (
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
  );
};

const PlanChooseButton = ({
  plan,
  isSelectingPlan,
  selectedPlanType,
  onChoosePlan,
}: PricingPlanChooseButtonProps) => (
  <Button
    type='button'
    variant={isPopularPlan(plan) ? 'default' : 'outline'}
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
);

const PricingPlansComparisonTable: React.FC<
  PricingPlansComparisonTableProps
> = ({ plans, selection }) => {
  // Rows follow the first plan's feature order; any feature that only exists
  // on a later plan is appended so nothing is dropped.
  const featureRows = plans
    .flatMap((plan) => plan.features)
    .filter(
      (feature, index, all) =>
        all.findIndex((f) => f.code === feature.code) === index,
    );

  // Mobile opens on the user's current plan, else the recommended one.
  const defaultTab = (
    plans.find((plan) => plan.current_plan) ??
    plans.find(isPopularPlan) ??
    plans[0]
  )?.alias;

  return (
    <>
      {/* Mobile: one plan at a time, switched with tabs. */}
      <Tabs
        defaultValue={defaultTab}
        className='mx-auto w-full max-w-2xl lg:hidden'
      >
        <TabsList
          className='bg-muted/70 w-full gap-1 rounded-xl'
          style={{ height: 'auto', padding: '0.25rem' }}
        >
          {plans.map((plan) => (
            <TabsTrigger
              key={plan.alias}
              value={plan.alias}
              className='flex-col gap-0 rounded-lg py-1.5'
            >
              <span className='text-sm font-semibold'>{plan.name}</span>
              <span className='text-muted-foreground text-[11px] font-medium tabular-nums'>
                {getCurrencySign()}
                {Number(plan.discounted_price ?? plan.monthly_price).toFixed(2)}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>

        {plans.map((plan) => {
          const meta = getPlanMeta(plan);

          return (
            <TabsContent key={plan.alias} value={plan.alias} className='pt-5'>
              <div
                className={cn(
                  'relative rounded-t-2xl px-4 pt-6 pb-5 text-center',
                  meta.header,
                )}
              >
                <PlanHeading plan={plan} />
              </div>
              <div
                className={cn(
                  'rounded-b-2xl border-b px-4 pt-4 pb-5',
                  meta.column,
                )}
              >
                <PlanLimits plan={plan} />

                <ul className='divide-border/60 mt-4 divide-y'>
                  {featureRows.map((row) => (
                    <li
                      key={row.code}
                      className='flex items-center justify-between gap-4 py-3 text-sm'
                    >
                      <span className='font-medium'>{row.name}</span>
                      <span className='flex shrink-0 justify-end text-right'>
                        <FeatureCell
                          feature={plan.features.find(
                            (f) => f.code === row.code,
                          )}
                        />
                      </span>
                    </li>
                  ))}
                </ul>

                {selection && (
                  <div className='mt-4'>
                    <PlanChooseButton plan={plan} {...selection} />
                  </div>
                )}
              </div>
            </TabsContent>
          );
        })}
      </Tabs>

      {/* Desktop: full side-by-side comparison. */}
      <div className='bg-card/80 hidden rounded-3xl border p-5 shadow-sm backdrop-blur-sm lg:block'>
        <div className='-mx-5 overflow-x-auto px-5 pt-4'>
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
                {plans.map((plan) => (
                  <th
                    key={plan.alias}
                    scope='col'
                    className={cn(
                      'relative rounded-t-2xl px-4 pt-6 pb-5 text-center font-normal',
                      getPlanMeta(plan).header,
                    )}
                  >
                    <PlanHeading plan={plan} />
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              <tr>
                <td aria-hidden='true' />
                {plans.map((plan) => (
                  <td
                    key={plan.alias}
                    className={cn('px-3 pt-3 pb-4', getPlanMeta(plan).column)}
                  >
                    <PlanLimits plan={plan} />
                  </td>
                ))}
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
                        <span className='flex justify-center'>
                          <FeatureCell
                            feature={plan.features.find(
                              (f) => f.code === row.code,
                            )}
                          />
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}

              <tr>
                <td />
                {plans.map((plan) => (
                  <td
                    key={plan.alias}
                    className={cn(
                      'rounded-b-2xl border-t border-b px-4',
                      selection ? 'pt-4 pb-5' : 'pt-2',
                      getPlanMeta(plan).column,
                      'border-t-border/60',
                    )}
                  >
                    {selection && (
                      <PlanChooseButton plan={plan} {...selection} />
                    )}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default PricingPlansComparisonTable;
