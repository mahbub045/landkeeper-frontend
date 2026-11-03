import type { LucideIcon } from 'lucide-react';

export interface CommonPermissions {
  can_create_property: boolean;
  property_count: number;
  max_properties: number;
  can_add_user: boolean;
  user_count: number;
  max_users: number;
}

export interface LimitReachedAlertProps {
  /** Plural resource name, e.g. "properties" or "users" */
  resource: string;
  max: number;
}

export interface UsageLimitProps {
  icon: LucideIcon;
  label: string;
  used: number;
  max: number;
}
