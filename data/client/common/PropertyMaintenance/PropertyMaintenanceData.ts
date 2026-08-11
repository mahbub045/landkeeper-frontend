import { MaintenanceStatus } from '@/types/client/Common/PropertyMaintenance/PropertyMaintenanceType';

export const STATUS_STYLES: Record<MaintenanceStatus, string> = {
  SUBMITTED: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  ASSIGNED: 'bg-blue-50 text-blue-700 ring-blue-600/20',
  IN_PROGRESS: 'bg-blue-50 text-blue-700 ring-blue-600/20',
  COMPLETED: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
};
