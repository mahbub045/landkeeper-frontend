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
      'bg-linear-to-b from-sky-100 to-sky-50 text-sky-950 dark:from-sky-900/50 dark:to-sky-900/30 dark:text-sky-50',
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
      'bg-linear-to-b from-violet-600 to-violet-700 text-white shadow-[0_14px_32px_-16px_var(--color-violet-500)]',
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
      'bg-linear-to-b from-slate-800 to-slate-950 text-white dark:from-slate-700 dark:to-slate-900',
    column: 'bg-card border-x border-slate-200 dark:border-white/10',
    rowHover: 'group-hover:bg-slate-50 dark:group-hover:bg-white/5',
  },
} as const;
