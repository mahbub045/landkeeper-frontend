import { LandlordDetailsTab } from '@/store/slices/landlordDetailsTabSlice';
import { LucideIcon } from 'lucide-react';

export type LandlordPlan = 'BASIC' | 'STANDARD' | 'PREMIUM';

export interface LandlordType {
  alias: string;
  email: string;
  title: string | null;
  first_name: string;
  middle_name: string;
  last_name: string;
  current_address: string | null;
  ni_number: string | null;
  utr_number: string | null;
  role: string;
  phone: string | null;
  profile_image: string | null;
  is_active: boolean;
  is_password_available: boolean;
  has_subscription: boolean;
  subscription_status: string | null;
  plan: LandlordPlan | null;
  trial_days_left: number | null;
  created_at: string;
  updated_at: string;
}

export interface LandlordListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: LandlordType[];
}

export type LandlordSubscriptionStatus =
  'PENDING' | 'ACTIVE' | 'TRIALING' | 'PAST_DUE' | 'CANCELLED' | 'EXPIRED';

export interface LandlordFilterValues {
  is_active: 'all' | 'true' | 'false';
  subscription_status: 'all' | LandlordSubscriptionStatus;
  plan_type: 'all' | LandlordPlan;
  created_at_from: string;
  created_at_to: string;
}

export interface LandlordListParams {
  page: number;
  page_size?: number;
  search?: string;
  is_active?: boolean;
  organisation_users__organisation__subscription__status?: LandlordSubscriptionStatus;
  organisation_users__organisation__subscription__plan__plan_type?: LandlordPlan;
  created_at__gte?: string;
  created_at__lte?: string;
}

// ---- Landlord details page ----

export interface LandlordDetailsTabItem {
  key: LandlordDetailsTab;
  label: string;
  icon: LucideIcon;
  /** Icon tile colours */
  color: string;
}

export interface LandlordDetailsTabGroup {
  label: string;
  tabs: LandlordDetailsTabItem[];
}

// ---- Overview tab ----

export interface OverviewTabProps {
  landlord_uid: string;
}

/** Props for components that only need the landlord */
export interface LandlordProps {
  landlord: LandlordType;
}

export interface ProfileHeaderProps {
  landlord: LandlordType;
  fullName: string;
}

export interface StatTileProps {
  icon: LucideIcon;
  color: string;
  label: string;
  children: React.ReactNode;
}

export interface InfoSectionProps {
  title: string;
  icon: LucideIcon;
  /** Optional element on the right of the header, e.g. an Edit button */
  action?: React.ReactNode;
  children: React.ReactNode;
}

export interface InfoRowProps {
  icon: LucideIcon;
  label: string;
  value: React.ReactNode;
}

export interface PersonalInfoProps {
  landlord: LandlordType;
  landlord_uid: string;
  fullName: string;
}

export interface PersonalInfoForm {
  title: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  phone: string;
  current_address: string;
  ni_number: string;
  utr_number: string;
}

export interface EditPersonalInfoDialogProps {
  open: boolean;
  onClose: () => void;
  landlord: LandlordType;
  landlord_uid: string;
}

export interface FormFieldProps {
  id: string;
  label: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}

export interface DeleteLandlordProps {
  landlord: LandlordType;
  landlord_uid: string;
  fullName: string;
}
