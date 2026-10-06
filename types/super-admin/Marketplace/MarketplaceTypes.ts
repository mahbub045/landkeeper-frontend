import { LucideIcon } from 'lucide-react';

// Category as returned by GET /marketplace/categories.
export interface MarketplaceApiCategory {
  alias: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  display_order: number;
  is_active: boolean;
  provider_count: number;
  created_at: string;
  updated_at: string;
}

export interface MarketplaceCategoryColor {
  icon_bg: string;
  icon_color: string;
}

export interface CategoryCardsProps {
  categories?: MarketplaceApiCategory[];
  isLoading: boolean;
  isError: boolean;
  selected: string;
  onSelect: (slug: string) => void;
}

// Provider as returned by GET /marketplace/providers.
export interface MarketplaceProviderCategory {
  alias: string;
  name: string;
  slug: string;
  icon: string | null;
}

export interface MarketplaceProvider {
  alias: string;
  name: string;
  slug: string;
  logo: string | null;
  short_description: string | null;
  description: string | null;
  services_offered: string[];
  website_url: string | null;
  referral_url: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  address: string | null;
  is_verified: boolean;
  is_featured: boolean;
  is_active: boolean;
  display_order: number;
  categories: MarketplaceProviderCategory[];
  created_at: string;
  updated_at: string;
}

export interface MarketplaceProvidersResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: MarketplaceProvider[];
}

export interface ServiceCardProps {
  provider: MarketplaceProvider;
}

export interface MarketplaceProvidersParams {
  page: number;
  page_size: number;
  search?: string;
  categories__slug?: string;
  is_verified?: boolean;
  is_active?: boolean;
}

export interface MarketplacePaginationProps {
  page: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  // Plural noun in the "Showing x to y of z ..." line. Defaults to "Services".
  itemLabel?: string;
}

export type MarketplaceBooleanFilter = 'ALL' | 'true' | 'false';

export interface MarketplaceFilterOption {
  value: MarketplaceBooleanFilter;
  label: string;
}

export interface MarketplaceFilterSelectProps {
  label: string;
  value: MarketplaceBooleanFilter;
  options: MarketplaceFilterOption[];
  onChange: (value: MarketplaceBooleanFilter) => void;
}

export interface ProviderDetailsDialogProps {
  provider: MarketplaceProvider;
  open: boolean;
  onClose: () => void;
}

export interface ProviderContactItem {
  icon: LucideIcon;
  title?: string;
  label: string;
  href?: string;
  external?: boolean;
}

export interface MarketplaceCategoryPayload {
  name: string;
  description: string;
  icon: string | null;
  display_order: number;
  is_active: boolean;
}

export interface MarketplaceCategoryForm {
  name: string;
  description: string;
  icon: string;
  display_order: string;
  is_active: boolean;
}

export interface CategoryFormDialogProps {
  open: boolean;
  onClose: () => void;
  // When provided the dialog edits this category, otherwise it creates one.
  category?: MarketplaceApiCategory | null;
  nextDisplayOrder?: number;
}

export interface DeleteCategoryDialogProps {
  open: boolean;
  onClose: () => void;
  category: MarketplaceApiCategory | null;
}

export interface UpdateMarketplaceCategoryArgs {
  alias: string;
  payload: Partial<MarketplaceCategoryPayload>;
}

export interface MarketplaceCategoryIconProps {
  // Lucide icon name stored on the category (e.g. "check").
  icon?: string | null;
  // Picks the icon colour; pass the category alias so it stays stable.
  seed?: string | null;
  className?: string;
  iconClassName?: string;
}

export interface MarketplaceProviderPayload {
  name: string;
  short_description: string;
  description: string;
  services_offered: string[];
  website_url: string;
  referral_url: string;
  contact_email: string;
  contact_phone: string;
  address: string;
  is_verified: boolean;
  is_featured: boolean;
  is_active: boolean;
  display_order: number;
  category_aliases: string[];
  // Only sent as null to remove an existing logo; new logos go via FormData.
  logo?: null;
}

export interface MarketplaceProviderForm extends Omit<
  MarketplaceProviderPayload,
  'display_order' | 'logo'
> {
  display_order: string;
}

export interface UpdateMarketplaceProviderArgs {
  alias: string;
  payload: Partial<MarketplaceProviderPayload> | FormData;
}

export interface ProviderFormDialogProps {
  open: boolean;
  onClose: () => void;
  // When provided the dialog edits this provider, otherwise it creates one.
  provider?: MarketplaceProvider | null;
  nextDisplayOrder?: number;
}

export interface DeleteProviderDialogProps {
  open: boolean;
  onClose: () => void;
  provider: MarketplaceProvider | null;
}
