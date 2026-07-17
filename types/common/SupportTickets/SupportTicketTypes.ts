export type SupportTicketType = 'FEEDBACK' | 'BUG_REPORT' | 'FEATURE_REQUEST';

export type SupportTicketPriority =
  | 'URGENT'
  | 'MEDIUM'
  | 'NORMAL'
  | 'WHEN_POSSIBLE';

export type SupportTicketStatus =
  | 'OPEN'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'RESOLVED'
  | 'CLOSED';

export interface ApiSupportTicketFile {
  alias: string;
  file: string;
}

export interface ApiSupportTicketCreatedBy {
  id: number;
  alias: string;
  profile_image: string;
  name: string;
  email: string;
  role: string;
}

export interface ApiSupportTicketType {
  alias: string;
  ticket_id: string;
  ticket_type: SupportTicketType;
  subject: string;
  status: SupportTicketStatus;
  priority: SupportTicketPriority;
  description: string;
  files: ApiSupportTicketFile[];
  created_at: string;
  created_by: ApiSupportTicketCreatedBy;
  fileCount: number;
}

// Display/UI shape mapped from ApiSupportTicket

export interface SupportTicketRowProps {
  ticket: ApiSupportTicketType;
  apiTicket: ApiSupportTicketType;
  idx: number;
}

export interface SupportTicketTableProps {
  supportTicketsData: ApiSupportTicketType[];
  search: string;
  onSearchChange: (value: string) => void;
  isLoading: boolean;
}

export interface SupportTicketForm {
  ticketType: SupportTicketType | '';
  priority: SupportTicketPriority | '';
  subject: string;
  description: string;
}

export interface AddSupportTicketModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export interface UpdateSupportTicketDialogProps {
  ticket?: ApiSupportTicketType;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export interface DeleteSupportTicketDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  ticketAlias: string;
}

export interface ApiSupportTicketComment {
  id: number;
  alias: string;
  message: string;
  parent: number | null;
  author: ApiSupportTicketCreatedBy;
  files: ApiSupportTicketFile[];
  replies: ApiSupportTicketComment[];
  created_at: string;
}
