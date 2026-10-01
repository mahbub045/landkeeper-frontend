import { LandlordPlan } from '@/types/super-admin/Landlords/Overview/OverviewType';

export const PLAN_STYLES: Record<LandlordPlan, string> = {
  BASIC: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400',
  STANDARD:
    'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
  PREMIUM:
    'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
};
