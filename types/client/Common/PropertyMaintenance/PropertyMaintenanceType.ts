export type MaintenanceStatus =
  | 'SUBMITTED'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'COMPLETED';
export type MaintenanceCategory = 'PLUMBING' | 'CARPENTRY_SECURITY' | 'OTHER';

export interface MaintenanceDocument {
  id: number;
  file: string;
  length: number;
}

interface Tenant {
  alias: string;
  email: string;
  name: string;
  avatar?: string;
  phone?: string;
}

export interface MaintenanceRequest {
  alias: string;
  request_id: string;
  tenant: Tenant;
  property: string;
  issue: string;
  category: MaintenanceCategory;
  current_status: MaintenanceStatus;
  is_emergency: boolean;
  documents?: MaintenanceDocument[];
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface MaintenanceRequestDialogProps {
  isOpen: boolean;
  onClose: () => void;
}
export interface EditMaintenanceRequestDialogProps {
  isOpen: boolean;
  onClose: () => void;
  maintenanceRequestAlias: string;
}

export type ExistingDocument = MaintenanceDocument;
export interface EditMaintenanceRequestFormProps {
  requestDetails: Partial<FormValues> & { documents?: ExistingDocument[] };
  maintenanceRequestAlias: string;
  onClose: () => void;
}
export type FormValues = {
  issue: string;
  category: MaintenanceCategory | '';
  is_emergency: boolean;
  notes: string;
};

export interface DeleteMaintenanceRequestDialogProps {
  isOpen: boolean;
  onClose: () => void;
  maintenanceRequestAlias: string;
  maintenanceRequestId: string;
}

export interface PropertyMaintenanceCommentsProps {
  pmAlias: string;
}

export interface PropertyMaintenanceCommentAuthor {
  email: string;
  name: string;
  profile_image: string | null;
  role?: string;
}

export interface PropertyMaintenanceCommentFile {
  id: number;
  file: string;
}

export interface ApiPropertyMaintenanceComment {
  id: number;
  alias: string;
  message: string;
  author: PropertyMaintenanceCommentAuthor;
  documents: PropertyMaintenanceCommentFile[];
  parent: number | null;
  replies: ApiPropertyMaintenanceComment[];
  created_at: string;
  updated_at?: string;
}
