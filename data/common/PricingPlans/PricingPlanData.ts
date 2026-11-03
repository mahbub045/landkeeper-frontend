import { Crown, Gem, Sparkles } from 'lucide-react';

export const pricingPlanMeta = {
  STARTER: {
    eyebrow: 'A focused start',
    accent:
      'border-sky-200 bg-sky-50/40 dark:border-sky-400/20 dark:bg-sky-400/[0.04]',
    bar: 'bg-sky-500',
    iconTile: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400',
    icon: Sparkles,
    header:
      'bg-linear-to-br from-sky-50 via-sky-100 to-cyan-200 text-sky-900 ring-1 ring-inset ring-sky-200/80 shadow-[0_14px_32px_-18px_var(--color-sky-400)] dark:from-sky-400/15 dark:via-sky-400/10 dark:to-cyan-400/20 dark:text-sky-100 dark:ring-sky-400/20',
    column: 'bg-card border-x border-sky-200/80 dark:border-sky-400/20',
    rowHover: 'group-hover:bg-sky-50/70 dark:group-hover:bg-sky-400/5',
  },
  STANDARD: {
    eyebrow: 'Most popular',
    accent:
      'border-violet-300 bg-violet-50/50 shadow-[0_18px_60px_-30px_var(--color-violet-500)] dark:border-violet-400/30 dark:bg-violet-400/[0.06]',
    bar: 'bg-violet-500',
    iconTile:
      'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
    icon: Crown,
    header:
      'bg-linear-to-br from-violet-50 via-violet-100 to-fuchsia-200 text-violet-900 ring-1 ring-inset ring-violet-200/80 shadow-[0_14px_32px_-18px_var(--color-violet-400)] dark:from-violet-400/15 dark:via-violet-400/10 dark:to-fuchsia-400/20 dark:text-violet-100 dark:ring-violet-400/20',
    column:
      'bg-violet-50/70 border-x border-violet-300 dark:bg-violet-400/[0.06] dark:border-violet-400/30',
    rowHover: 'group-hover:bg-violet-100/70 dark:group-hover:bg-violet-400/10',
  },
  PREMIUM: {
    eyebrow: 'For serious portfolios',
    accent:
      'border-amber-300/80 bg-amber-50/50 dark:border-amber-300/30 dark:bg-amber-300/[0.06]',
    bar: 'bg-amber-500',
    iconTile:
      'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    icon: Gem,
    header:
      'bg-linear-to-br from-amber-50 via-amber-100 to-orange-200 text-amber-900 ring-1 ring-inset ring-amber-200/80 shadow-[0_14px_32px_-18px_var(--color-amber-400)] dark:from-amber-300/15 dark:via-amber-300/10 dark:to-orange-400/20 dark:text-amber-100 dark:ring-amber-300/20',
    column:
      'bg-amber-50/50 border-x border-amber-300/80 dark:bg-amber-300/[0.06] dark:border-amber-300/30',
    rowHover: 'group-hover:bg-amber-100/70 dark:group-hover:bg-amber-300/10',
  },
} as const;
