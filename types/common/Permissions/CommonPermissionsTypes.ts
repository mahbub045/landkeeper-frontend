import type { LucideIcon } from 'lucide-react';

export interface CommonPermissions {
  can_create_property: boolean;
  property_count: number;
  /** null = unlimited */
  max_properties: number | null;
  can_add_user: boolean;
  user_count: number;
  /** null = unlimited */
  max_users: number | null;
}

export interface LimitReachedAlertProps {
  /** Plural resource name, e.g. "properties" or "users" */
  resource: string;
  max: number | null;
}

export interface UsageLimitProps {
  icon: LucideIcon;
  label: string;
  used: number;
  /** null = unlimited */
  max: number | null;
}
