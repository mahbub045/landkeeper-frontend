import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

export interface DeleteImpactItem {
  icon: LucideIcon;
  label: string;
}

export interface DeleteConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  confirmDisabled?: boolean;

  title: string;
  description?: ReactNode;
  icon?: LucideIcon;

  targetLabel?: string;
  targetName?: ReactNode;
  targetSubtext?: ReactNode;
  targetIcon?: LucideIcon;
  targetMedia?: ReactNode;
  badge?: string | null;

  impactTitle?: string;
  impactItems?: DeleteImpactItem[];
  impactNote?: ReactNode;

  error?: string | null;

  /** When set, the user must type this exact text to enable the confirm button */
  confirmText?: string;

  cancelLabel?: string;
  confirmLabel: string;
}
