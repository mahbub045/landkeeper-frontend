import {
  MarketplaceCategoryColor,
  MarketplaceFilterOption,
} from '@/types/super-admin/Marketplace/MarketplaceTypes';

export const HOW_IT_WORKS_STEPS = [
  {
    title: 'Browse & compare',
    description:
      'Search by service, category or area and compare ratings, coverage and pricing.',
  },
  {
    title: 'Get in touch',
    description:
      'Open a provider to see full details and contact them directly for a quote.',
  },
  {
    title: 'Manage in one place',
    description:
      'Keep certificates, invoices and maintenance records linked to your properties.',
  },
];

// Colour pairs for category icons. Full class names are listed so Tailwind
// keeps them in the build.
const CATEGORY_COLORS: MarketplaceCategoryColor[] = [
  {
    icon_bg: 'bg-purple-100 dark:bg-purple-900/30',
    icon_color: 'text-purple-600 dark:text-purple-400',
  },
  {
    icon_bg: 'bg-sky-100 dark:bg-sky-900/30',
    icon_color: 'text-sky-600 dark:text-sky-400',
  },
  {
    icon_bg: 'bg-violet-100 dark:bg-violet-900/30',
    icon_color: 'text-violet-600 dark:text-violet-400',
  },
  {
    icon_bg: 'bg-orange-100 dark:bg-orange-900/30',
    icon_color: 'text-orange-600 dark:text-orange-400',
  },
  {
    icon_bg: 'bg-blue-100 dark:bg-blue-900/30',
    icon_color: 'text-blue-600 dark:text-blue-400',
  },
  {
    icon_bg: 'bg-emerald-100 dark:bg-emerald-900/30',
    icon_color: 'text-emerald-600 dark:text-emerald-400',
  },
  {
    icon_bg: 'bg-amber-100 dark:bg-amber-900/30',
    icon_color: 'text-amber-600 dark:text-amber-400',
  },
  {
    icon_bg: 'bg-rose-100 dark:bg-rose-900/30',
    icon_color: 'text-rose-600 dark:text-rose-400',
  },
  {
    icon_bg: 'bg-teal-100 dark:bg-teal-900/30',
    icon_color: 'text-teal-600 dark:text-teal-400',
  },
  {
    icon_bg: 'bg-indigo-100 dark:bg-indigo-900/30',
    icon_color: 'text-indigo-600 dark:text-indigo-400',
  },
  {
    icon_bg: 'bg-pink-100 dark:bg-pink-900/30',
    icon_color: 'text-pink-600 dark:text-pink-400',
  },
  {
    icon_bg: 'bg-cyan-100 dark:bg-cyan-900/30',
    icon_color: 'text-cyan-600 dark:text-cyan-400',
  },
];

const DEFAULT_CATEGORY_COLOR: MarketplaceCategoryColor = {
  icon_bg: 'bg-slate-100 dark:bg-slate-800',
  icon_color: 'text-slate-700 dark:text-slate-300',
};

// Picks a colour that looks random but is stable for a given seed (the
// category alias), so a category keeps the same colour on every page.
export function getCategoryColor(seed?: string | null) {
  if (!seed) return DEFAULT_CATEGORY_COLOR;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  }
  return CATEGORY_COLORS[Math.abs(hash) % CATEGORY_COLORS.length];
}
export const VERIFIED_FILTER_OPTIONS: MarketplaceFilterOption[] = [
  { value: 'ALL', label: 'All' },
  { value: 'true', label: 'Yes' },
  { value: 'false', label: 'No' },
];

export const STATUS_FILTER_OPTIONS: MarketplaceFilterOption[] = [
  { value: 'ALL', label: 'All' },
  { value: 'true', label: 'Active' },
  { value: 'false', label: 'Inactive' },
];
