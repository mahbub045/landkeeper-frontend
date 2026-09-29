import { LucideIcon } from 'lucide-react';

export type MarketplaceCategoryKey =
  | 'MAINTENANCE_REPAIRS'
  | 'COMPLIANCE_LEGAL'
  | 'INSURANCE'
  | 'PROPERTY_MANAGEMENT'
  | 'ENERGY_UTILITIES'
  | 'CLEANING_GROUNDS'
  | 'OTHER';

export type MarketplaceCoverage =
  'NATIONWIDE' | 'LONDON' | 'SOUTH_EAST' | 'NORTH_WEST' | 'MIDLANDS';

export type MarketplaceSort = 'RECOMMENDED' | 'RATING' | 'REVIEWS';

export interface MarketplaceCategory {
  key: MarketplaceCategoryKey;
  label: string;
  service_count: number;
  icon: LucideIcon;
  icon_bg: string;
  icon_color: string;
  badge_class_name: string;
}

export interface MarketplaceService {
  id: string;
  name: string;
  brand_name: string;
  brand_tagline: string;
  brand_icon: LucideIcon;
  brand_color: string;
  // Renders the logo panel on a dark background (e.g. CompliancePro).
  dark_logo?: boolean;
  category: MarketplaceCategoryKey;
  description: string;
  rating: number;
  review_count: number;
  coverage: MarketplaceCoverage;
  coverage_label: string;
  price_label: string;
  featured: boolean;
}

export interface PopularService {
  label: string;
  description: string;
  icon: LucideIcon;
  icon_bg: string;
  icon_color: string;
  search: string;
}
