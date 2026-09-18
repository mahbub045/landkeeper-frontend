import { Crown, Gem, Sparkles } from 'lucide-react';

export const pricingPlanMeta = {
  BASIC: {
    eyebrow: 'A focused start',
    accent:
      'border-slate-200 bg-white dark:border-white/10 dark:bg-white/[0.04]',
    icon: Sparkles,
  },
  STANDARD: {
    eyebrow: 'Most popular',
    accent:
      'border-primary/50 bg-primary/[0.04] shadow-[0_18px_60px_-30px_var(--primary)] dark:bg-primary/[0.08]',
    icon: Crown,
  },
  PREMIUM: {
    eyebrow: 'For serious portfolios',
    accent:
      'border-amber-300/80 bg-amber-50/70 dark:border-amber-300/30 dark:bg-amber-300/[0.08]',
    icon: Gem,
  },
} as const;

export const pricingPlanBadgeStyles = {
  BASIC: 'bg-slate-700 text-white dark:bg-slate-600 ',
  STANDARD: 'bg-primary text-white dark:bg-primary dark:text-white',
  PREMIUM:
    'bg-amber-500 text-white dark:bg-amber-500 dark:text-white font-semibold',
} as const;
