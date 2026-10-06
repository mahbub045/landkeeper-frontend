import { LandlordPlan } from '@/types/super-admin/Landlords/Overview/OverviewType';
import { PricingPlanStyle } from '@/types/super-admin/PricingPlans/PricingPlansType';
import { Crown, Gem, Sparkles } from 'lucide-react';

export const PRICING_PLAN_STYLES: Record<LandlordPlan, PricingPlanStyle> = {
  BASIC: {
    icon: Sparkles,
    bar: 'bg-sky-500',
    iconTile: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400',
  },
  STANDARD: {
    icon: Crown,
    bar: 'bg-violet-500',
    iconTile:
      'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
  },
  PREMIUM: {
    icon: Gem,
    bar: 'bg-amber-500',
    iconTile:
      'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  },
};

export const PRICING_PLAN_VISIBLE_FEATURES = 10;
