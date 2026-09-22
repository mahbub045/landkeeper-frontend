import {
  CheckCircle2,
  Clock,
  Loader,
  LucideIcon,
  RotateCcw,
  XCircle,
} from 'lucide-react';

export const STATUS_CONFIG: Record<
  string,
  { label: string; icon: LucideIcon; className: string }
> = {
  CLEARED: {
    label: 'Cleared',
    icon: CheckCircle2,
    className: 'border-green-200 bg-green-50 text-green-700',
  },
  PENDING: {
    label: 'Pending',
    icon: Clock,
    className: 'border-amber-200 bg-amber-50 text-amber-700',
  },
  PROCESSING: {
    label: 'Processing',
    icon: Loader,
    className: 'border-blue-200 bg-blue-50 text-blue-700',
  },
  FAILED: {
    label: 'Failed',
    icon: XCircle,
    className: 'border-red-200 bg-red-50 text-red-700',
  },
  REFUNDED: {
    label: 'Refunded',
    icon: RotateCcw,
    className: 'border-slate-200 bg-slate-50 text-slate-700',
  },
};
