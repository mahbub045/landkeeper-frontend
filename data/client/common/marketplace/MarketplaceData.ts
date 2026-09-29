import {
  MarketplaceCategory,
  MarketplaceCoverage,
  MarketplaceService,
  MarketplaceSort,
  PopularService,
} from '@/types/client/Common/Marketplace/MarketplaceTypes';
import {
  Ellipsis,
  FileText,
  House,
  HousePlus,
  Leaf,
  Scale,
  Shield,
  ShieldCheck,
  ShieldPlus,
  Sparkles,
  Wrench,
  Zap,
} from 'lucide-react';

// Static placeholder data until the marketplace API is available.

export const MARKETPLACE_CATEGORIES: MarketplaceCategory[] = [
  {
    key: 'MAINTENANCE_REPAIRS',
    label: 'Maintenance & Repairs',
    service_count: 12,
    icon: Wrench,
    icon_bg: 'bg-blue-100 dark:bg-blue-900/30',
    icon_color: 'text-blue-600 dark:text-blue-400',
    badge_class_name:
      'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  },
  {
    key: 'COMPLIANCE_LEGAL',
    label: 'Compliance & Legal',
    service_count: 8,
    icon: ShieldCheck,
    icon_bg: 'bg-green-100 dark:bg-green-900/30',
    icon_color: 'text-green-600 dark:text-green-400',
    badge_class_name:
      'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300',
  },
  {
    key: 'INSURANCE',
    label: 'Insurance',
    service_count: 6,
    icon: ShieldPlus,
    icon_bg: 'bg-purple-100 dark:bg-purple-900/30',
    icon_color: 'text-purple-600 dark:text-purple-400',
    badge_class_name:
      'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300',
  },
  {
    key: 'PROPERTY_MANAGEMENT',
    label: 'Property Management',
    service_count: 5,
    icon: House,
    icon_bg: 'bg-emerald-100 dark:bg-emerald-900/30',
    icon_color: 'text-emerald-600 dark:text-emerald-400',
    badge_class_name:
      'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  },
  {
    key: 'ENERGY_UTILITIES',
    label: 'Energy & Utilities',
    service_count: 4,
    icon: Zap,
    icon_bg: 'bg-amber-100 dark:bg-amber-900/30',
    icon_color: 'text-amber-600 dark:text-amber-400',
    badge_class_name:
      'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  },
  {
    key: 'CLEANING_GROUNDS',
    label: 'Cleaning & Grounds',
    service_count: 3,
    icon: Sparkles,
    icon_bg: 'bg-violet-100 dark:bg-violet-900/30',
    icon_color: 'text-violet-600 dark:text-violet-400',
    badge_class_name:
      'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
  },
  {
    key: 'OTHER',
    label: 'Other Services',
    service_count: 2,
    icon: Ellipsis,
    icon_bg: 'bg-slate-100 dark:bg-slate-800',
    icon_color: 'text-slate-700 dark:text-slate-300',
    badge_class_name:
      'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  },
];

export const MARKETPLACE_SERVICES: MarketplaceService[] = [
  {
    id: 'homefix',
    name: 'HomeFix Property Maintenance',
    brand_name: 'HomeFix',
    brand_tagline: 'Property Maintenance',
    brand_icon: HousePlus,
    brand_color: 'text-slate-800 dark:text-slate-100',
    category: 'MAINTENANCE_REPAIRS',
    description:
      'Reliable, professional maintenance services for landlords. From emergency call-outs to planned works, we keep your properties in top condition.',
    rating: 4.8,
    review_count: 124,
    coverage: 'LONDON',
    coverage_label: 'London & surrounding areas',
    price_label: 'From £60 per visit',
    featured: true,
  },
  {
    id: 'compliancepro',
    name: 'CompliancePro',
    brand_name: 'CompliancePro',
    brand_tagline: 'Safer properties. Fully compliant',
    brand_icon: ShieldCheck,
    brand_color: 'text-white',
    dark_logo: true,
    category: 'COMPLIANCE_LEGAL',
    description:
      'Expert support with all aspects of property compliance, including gas, electrical, EPCs and Legionella risk assessments.',
    rating: 4.9,
    review_count: 89,
    coverage: 'NATIONWIDE',
    coverage_label: 'Nationwide',
    price_label: 'From £75 per property',
    featured: true,
  },
  {
    id: 'landlordinsure',
    name: 'LandlordInsure',
    brand_name: 'LandlordInsure',
    brand_tagline: 'Property Insurance Specialists',
    brand_icon: Shield,
    brand_color: 'text-slate-800 dark:text-slate-100',
    category: 'INSURANCE',
    description:
      'Specialist landlord insurance with flexible cover, competitive rates and a simple online process.',
    rating: 4.7,
    review_count: 156,
    coverage: 'NATIONWIDE',
    coverage_label: 'UK wide',
    price_label: 'From £89 per year',
    featured: true,
  },
  {
    id: 'rentsafe',
    name: 'RentSafe Property Management',
    brand_name: 'RentSafe',
    brand_tagline: 'Property Management',
    brand_icon: House,
    brand_color: 'text-slate-800 dark:text-slate-100',
    category: 'PROPERTY_MANAGEMENT',
    description:
      "Take the stress out of letting. We handle tenants, rent collection, maintenance and compliance — so you don't have to.",
    rating: 4.6,
    review_count: 73,
    coverage: 'LONDON',
    coverage_label: 'London & surrounding areas',
    price_label: 'From 8% + VAT of monthly rent',
    featured: true,
  },
  {
    id: 'greenwatt',
    name: 'GreenWatt Energy Advisors',
    brand_name: 'GreenWatt',
    brand_tagline: 'Energy & Utilities',
    brand_icon: Leaf,
    brand_color: 'text-slate-800 dark:text-slate-100',
    category: 'ENERGY_UTILITIES',
    description:
      'Switch suppliers, cut bills and improve EPC ratings with tailored energy efficiency upgrades for rental homes.',
    rating: 4.5,
    review_count: 48,
    coverage: 'NATIONWIDE',
    coverage_label: 'Nationwide',
    price_label: 'Free initial consultation',
    featured: false,
  },
  {
    id: 'sparkleclean',
    name: 'SparkleClean End of Tenancy',
    brand_name: 'SparkleClean',
    brand_tagline: 'Cleaning & Grounds',
    brand_icon: Sparkles,
    brand_color: 'text-slate-800 dark:text-slate-100',
    category: 'CLEANING_GROUNDS',
    description:
      'Deposit-ready end of tenancy cleans, garden tidy-ups and communal area maintenance for landlords and agents.',
    rating: 4.4,
    review_count: 61,
    coverage: 'SOUTH_EAST',
    coverage_label: 'South East England',
    price_label: 'From £150 per clean',
    featured: false,
  },
  {
    id: 'lettlaw',
    name: 'LettLaw Solicitors',
    brand_name: 'LettLaw',
    brand_tagline: 'Property Law Specialists',
    brand_icon: Scale,
    brand_color: 'text-slate-800 dark:text-slate-100',
    category: 'COMPLIANCE_LEGAL',
    description:
      'Fixed-fee legal support for landlords, including tenancy agreements, possession claims and rent disputes.',
    rating: 4.8,
    review_count: 102,
    coverage: 'NATIONWIDE',
    coverage_label: 'England & Wales',
    price_label: 'From £120 fixed fee',
    featured: false,
  },
  {
    id: 'northernheat',
    name: 'NorthernHeat Boiler Services',
    brand_name: 'NorthernHeat',
    brand_tagline: 'Heating & Boilers',
    brand_icon: Wrench,
    brand_color: 'text-slate-800 dark:text-slate-100',
    category: 'MAINTENANCE_REPAIRS',
    description:
      'Gas Safe registered engineers for boiler repairs, servicing and replacements with same-day call-outs.',
    rating: 4.6,
    review_count: 94,
    coverage: 'NORTH_WEST',
    coverage_label: 'North West England',
    price_label: 'From £70 per call-out',
    featured: false,
  },
];

export const POPULAR_SERVICES: PopularService[] = [
  {
    label: 'Boiler Repairs',
    description: 'Fast, reliable boiler engineers',
    icon: Wrench,
    icon_bg: 'bg-violet-100 dark:bg-violet-900/30',
    icon_color: 'text-violet-600 dark:text-violet-400',
    search: 'boiler',
  },
  {
    label: 'Gas Safety Certificates',
    description: 'Stay compliant with the law',
    icon: ShieldCheck,
    icon_bg: 'bg-blue-100 dark:bg-blue-900/30',
    icon_color: 'text-blue-600 dark:text-blue-400',
    search: 'gas',
  },
  {
    label: 'EPC Assessments',
    description: 'Get your energy performance certificate',
    icon: FileText,
    icon_bg: 'bg-sky-100 dark:bg-sky-900/30',
    icon_color: 'text-sky-600 dark:text-sky-400',
    search: 'EPC',
  },
  {
    label: 'Legal Advice',
    description: 'Expert property law support',
    icon: Scale,
    icon_bg: 'bg-purple-100 dark:bg-purple-900/30',
    icon_color: 'text-purple-600 dark:text-purple-400',
    search: 'legal',
  },
];

export const AREA_OPTIONS: {
  value: MarketplaceCoverage | 'ALL';
  label: string;
}[] = [
  { value: 'ALL', label: 'All Areas' },
  { value: 'LONDON', label: 'London' },
  { value: 'SOUTH_EAST', label: 'South East' },
  { value: 'NORTH_WEST', label: 'North West' },
  { value: 'MIDLANDS', label: 'Midlands' },
];

export const SORT_OPTIONS: { value: MarketplaceSort; label: string }[] = [
  { value: 'RECOMMENDED', label: 'Recommended' },
  { value: 'RATING', label: 'Highest rated' },
  { value: 'REVIEWS', label: 'Most reviewed' },
];

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

export const getCategory = (key: string) =>
  MARKETPLACE_CATEGORIES.find((c) => c.key === key);
