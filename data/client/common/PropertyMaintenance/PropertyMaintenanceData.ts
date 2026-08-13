import {
  MaintenanceCategory,
  MaintenanceStatus,
} from '@/types/client/Common/PropertyMaintenance/PropertyMaintenanceType';
import { CircleHelp, Hammer, Wrench } from 'lucide-react';


export const STATUS_EDITABLE_ROLES = ['LANDLORD', 'ADMIN'] as const;

export const canEditMaintenanceStatus = (role?: string) =>
  STATUS_EDITABLE_ROLES.includes(
    role as (typeof STATUS_EDITABLE_ROLES)[number],
  );

export const STATUS_OPTIONS: Array<{
  value: MaintenanceStatus;
  label: string;
}> = [
  { value: 'SUBMITTED', label: 'Submitted' },
  { value: 'ASSIGNED', label: 'Assigned' },
  { value: 'IN_PROGRESS', label: 'In progress' },
  { value: 'COMPLETED', label: 'Completed' },
];

export const CATEGORY_OPTIONS: Array<{
  value: MaintenanceCategory;
  label: string;
}> = [
  { value: 'PLUMBING', label: 'Plumbing' },
  { value: 'CARPENTRY_SECURITY', label: 'Carpentry & Security' },
  { value: 'OTHER', label: 'Other' },
];

export const STATUS_STYLES: Record<MaintenanceStatus, string> = {
  SUBMITTED: 'bg-red-100 text-red-700 ring-red-600/20',
  ASSIGNED: 'bg-blue-100 text-blue-700 ring-blue-600/20',
  IN_PROGRESS: 'bg-amber-100 text-amber-700 ring-amber-600/20',
  COMPLETED: 'bg-emerald-100 text-emerald-700 ring-emerald-600/20',
};

export const CATEGORY_STYLES: Record<MaintenanceCategory, string> = {
  PLUMBING: 'bg-sky-100 text-sky-700 ring-sky-600/20',
  CARPENTRY_SECURITY: 'bg-orange-100 text-orange-700 ring-orange-600/20',
  OTHER: 'bg-gray-100 text-gray-700 ring-gray-500/20',
};

export const STATUS_DOT: Record<keyof typeof STATUS_STYLES, string> = {
  SUBMITTED: 'bg-red-500',
  ASSIGNED: 'bg-blue-500',
  IN_PROGRESS: 'bg-amber-500',
  COMPLETED: 'bg-emerald-500',
};

export const CATEGORY_META: Record<
  MaintenanceCategory,
  { icon: React.ElementType; classes: string }
> = {
  PLUMBING: {
    icon: Wrench,
    classes: 'bg-sky-100 text-sky-700 ring-sky-600/20',
  },
  CARPENTRY_SECURITY: {
    icon: Hammer,
    classes: 'bg-orange-100 text-orange-700 ring-orange-600/20',
  },
  OTHER: {
    icon: CircleHelp,
    classes: 'bg-gray-100 text-gray-700 ring-gray-500/20',
  },
};



export const MAX_FILES = 5;
export const MAX_FILE_SIZE_MB = 20;
export const ACCEPTED_FILE_TYPES = '.jpg,.jpeg,.png,.pdf';
