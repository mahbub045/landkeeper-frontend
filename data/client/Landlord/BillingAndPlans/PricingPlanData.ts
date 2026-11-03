export const planTierTheme = {
  STARTER: {
    bar: 'before:bg-sky-500',
    container:
      'border-sky-200 from-sky-50 dark:border-sky-400/20 dark:from-sky-400/10',
    soft: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400',
    track: 'bg-sky-100 dark:bg-sky-900/30',
    fill: 'bg-sky-500',
  },
  STANDARD: {
    bar: 'before:bg-violet-500',
    container:
      'border-violet-200 from-violet-50 dark:border-violet-400/20 dark:from-violet-400/10',
    soft: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
    track: 'bg-violet-100 dark:bg-violet-900/30',
    fill: 'bg-violet-500',
  },
  PREMIUM: {
    bar: 'before:bg-amber-500',
    container:
      'border-amber-200 from-amber-50 dark:border-amber-400/20 dark:from-amber-400/10',
    soft: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    track: 'bg-amber-100 dark:bg-amber-900/30',
    fill: 'bg-amber-500',
  },
} as const;

export const pricingPlanBadgeStyles = {
  STARTER: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400',
  STANDARD:
    'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
  PREMIUM:
    'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
} as const;
