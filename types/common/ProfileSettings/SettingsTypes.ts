export interface ProfileInfo {
  email?: string;
  title?: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  profile_picture?: string;
  role?: string;
  phone?: string;
  is_active?: boolean;
  is_password_available?: boolean;
}

export interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
}

export interface UsageStat {
  label: string;
  value: string;
  percent: number;
}
