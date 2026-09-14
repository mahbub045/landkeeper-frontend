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
  BASIC: 'bg-slate-400 text-slate-700 dark:bg-slate-800 dark:text-slate-400',
  STANDARD: 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary',
  PREMIUM:
    'bg-amber-100 text-amber-700 dark:bg-amber-300/20 dark:text-amber-300',
} as const;
