import { LucideIcon } from 'lucide-react';

export interface DetailsPageHeaderProps {
  /** Small uppercase label above the title, e.g. "Mortgage record" */
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Badges / status pills shown under the title */
  meta?: React.ReactNode;
  /** Buttons shown on the right of the header */
  actions?: React.ReactNode;
  /** Tints the header to flag an urgent record (e.g. an emergency request) */
  tone?: 'default' | 'danger';
  showBack?: boolean;
  className?: string;
}

export interface DetailsSectionProps {
  title: React.ReactNode;
  icon?: LucideIcon;
  description?: React.ReactNode;
  /** Element shown on the right of the section header, e.g. a button */
  action?: React.ReactNode;
  tone?: 'default' | 'danger';
  className?: string;
  contentClassName?: string;
  children: React.ReactNode;
}

export interface DetailsInfoItemProps {
  icon?: LucideIcon;
  label: string;
  value: React.ReactNode;
  className?: string;
}

export interface DetailsRecordHistoryProps {
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface DetailsDangerZoneProps {
  title: string;
  description: string;
  onDeleteClick: () => void;
  buttonLabel?: string;
}

export interface DetailsCopyIdProps {
  /** Unique key the copied state is tracked by, usually the record alias */
  copyKey: string;
  value: string;
  label: string;
}

export interface DetailsEmptyStateProps {
  icon: LucideIcon;
  message: React.ReactNode;
  className?: string;
}
