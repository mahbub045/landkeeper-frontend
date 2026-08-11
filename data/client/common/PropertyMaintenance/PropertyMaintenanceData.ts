import {
  MaintenanceCategory,
  MaintenanceStatus,
} from '@/types/client/Common/PropertyMaintenance/PropertyMaintenanceType';
import { CircleHelp, Hammer, Wrench } from 'lucide-react';

export const STATUS_STYLES: Record<MaintenanceStatus, string> = {
  SUBMITTED: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  ASSIGNED: 'bg-blue-50 text-blue-700 ring-blue-600/20',
  IN_PROGRESS: 'bg-blue-50 text-blue-700 ring-blue-600/20',
  COMPLETED: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
};

export const STATUS_DOT: Record<keyof typeof STATUS_STYLES, string> = {
  SUBMITTED: 'bg-amber-500',
  ASSIGNED: 'bg-blue-500',
  IN_PROGRESS: 'bg-blue-500',
  COMPLETED: 'bg-emerald-500',
};

export const CATEGORY_META: Record<
  MaintenanceCategory,
  { icon: React.ElementType; classes: string }
> = {
  PLUMBING: {
    icon: Wrench,
    classes: 'bg-sky-50 text-sky-700 ring-sky-600/20',
  },
  CARPENTRY_SECURITY: {
    icon: Hammer,
    classes: 'bg-orange-50 text-orange-700 ring-orange-600/20',
  },
  OTHER: {
    icon: CircleHelp,
    classes: 'bg-gray-100 text-gray-700 ring-gray-500/20',
  },
};
