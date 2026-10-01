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

export interface LandlordListParams {
  page: number;
  page_size?: number;
  search?: string;
}
