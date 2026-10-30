import { PropertyDocument } from '@/types/client/Common/Properties/PropertyTypes';
import { LucideIcon } from 'lucide-react';

export interface TenantPropertyLandlord {
  name: string;
  contact_person: string | null;
  mobile: string | null;
  address: string | null;
}

export interface TenantPropertyDetails {
  alias: string;
  property_name: string;
  property_owner: string | null;
  company_name: string;
  property_type: string;
  status: string;
  address: string;
  year_built: number | null;
  property_tenure: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  room_name?: string | null;
  monthly_rent?: number | string | null;
  monthly_rental_income?: number | string | null;
  notes: string | null;
  documents?: PropertyDocument[];
  landlord?: TenantPropertyLandlord | null;
}

export interface TenantPropertyOverviewCardProps {
  property: TenantPropertyDetails;
}

export interface TenantLandlordCardProps {
  landlord: TenantPropertyLandlord;
}

export interface OverviewStatProps {
  icon: LucideIcon;
  label: string;
  value: React.ReactNode;
}

export interface ContactRowProps {
  icon: LucideIcon;
  label: string;
  value: string | null;
}
