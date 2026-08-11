export type MaintenanceStatus =
  | 'SUBMITTED'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'COMPLETED';
export type MaintenanceCategory = 'PLUMBING' | 'CARPENTRY_SECURITY' | 'OTHER';

export interface MaintenanceRequest {
  alias: string | number;
  request_id: string;
  tenant: string;
  property: string;
  issue: string;
  category: MaintenanceCategory;
  current_status: MaintenanceStatus;
  is_emergency: boolean;
  documents: string[];
  notes: string;
  created_at: string;
  updated_at: string;
}
