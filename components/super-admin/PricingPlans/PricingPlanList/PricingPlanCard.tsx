'use client';

import { Building2, Check, ListChecks } from 'lucide-react';
import { useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PLAN_STYLES } from '@/data/super-admin/Landlords/LandlordData';
import {
  PRICING_PLAN_STYLES,
  PRICING_PLAN_VISIBLE_FEATURES,
} from '@/data/super-admin/PricingPlans/PricingPlanData';
import { cn } from '@/lib/utils';
import { LandlordPlan } from '@/types/super-admin/Landlords/Overview/OverviewType';
import { PricingPlanCardProps } from '@/types/super-admin/PricingPlans/PricingPlansType';
import { formatChoiceFieldValue, getCurrencySign } from '@/utils/formatters';

const PricingPlanCard: React.FC<PricingPlanCardProps> = ({ plan }) => {
  const [expanded, setExpanded] = useState(false);
  const [listHeight, setListHeight] = useState<number | null>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Lock the list to its collapsed height so expanding scrolls instead of
  // growing the card.
  const toggleExpanded = () => {
    if (!expanded && listRef.current) {
      setListHeight(listRef.current.offsetHeight);
    }
    setExpanded((v) => !v);
  };

  const planType = plan.plan_type as LandlordPlan;
  const style = PRICING_PLAN_STYLES[planType] ?? PRICING_PLAN_STYLES.BASIC;
  const Icon = style.icon;

  const features = expanded
    ? plan.features
    : plan.features.slice(0, PRICING_PLAN_VISIBLE_FEATURES);
  const hiddenCount = plan.features.length - PRICING_PLAN_VISIBLE_FEATURES;

  const stats = [
    { label: 'Properties', value: plan.max_properties, icon: Building2 },
    { label: 'Features', value: plan.features.length, icon: ListChecks },
  ];

  return (
    <Card
      glow
      glowClassName='h-full'
      className='border-border relative h-full overflow-hidden rounded-2xl py-0'
    >
      <div className={cn('absolute inset-x-0 top-0 h-1', style.bar)} />

      <CardContent className='flex h-full flex-col gap-5 px-5 py-6'>
        <div className='flex items-start justify-between gap-3'>
          <div className='flex items-center gap-3'>
            <div
              className={cn(
                'flex size-11 shrink-0 items-center justify-center rounded-xl',
                style.iconTile,
              )}
            >
              <Icon className='size-5' aria-hidden='true' />
            </div>
            <div className='min-w-0'>
              <h3 className='text-foreground truncate text-lg font-semibold'>
                {plan.name}
              </h3>
              <span
                className={cn(
                  'mt-1 inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium',
                  PLAN_STYLES[planType] ?? PLAN_STYLES.BASIC,
                )}
              >
                {formatChoiceFieldValue(plan.plan_type)}
              </span>
            </div>
          </div>
        </div>

        <div className='flex items-end gap-1.5'>
          <span className='text-foreground text-4xl font-semibold tracking-tight'>
            {getCurrencySign()}
            {Number(plan.monthly_price).toFixed(2)}
          </span>
          <span className='text-muted-foreground mb-1 text-sm'>/ month</span>
        </div>

        <div className='border-border grid grid-cols-2 divide-x rounded-xl border'>
          {stats.map((stat) => (
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

        <div className='flex-1'>
          <p className='text-foreground text-sm font-semibold'>
            Included features
          </p>
          {plan.features.length === 0 ? (
            <p className='text-muted-foreground mt-3 text-sm'>
              No features configured.
            </p>
          ) : (
            <ul
              ref={listRef}
              className={cn(
                'mt-3 space-y-2.5',
                expanded && 'overflow-y-auto pr-1',
              )}
              style={
                expanded && listHeight ? { maxHeight: listHeight } : undefined
              }
            >
              {features.map((feature) => (
                <li
                  key={feature.code}
                  className='text-muted-foreground flex gap-2.5 text-sm'
                  title={feature.description}
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

          {hiddenCount > 0 && (
            <Button
              type='button'
              variant='link'
              onClick={toggleExpanded}
              className='mt-1 h-auto px-0 pl-6.5 text-xs'
              aria-expanded={expanded}
            >
              {expanded
                ? 'Show less'
                : `+ ${hiddenCount} more feature${hiddenCount === 1 ? '' : 's'}`}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PricingPlanCard;
