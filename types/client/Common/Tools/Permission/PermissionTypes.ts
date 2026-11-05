import type { LucideIcon } from 'lucide-react';

export type TabKey = 'properties' | 'mortgages';

export interface PermissionTab {
  key: TabKey;
  label: string;
  icon: LucideIcon;
}
