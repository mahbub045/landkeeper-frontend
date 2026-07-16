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

export interface ApiSupportTicketUser {
  id: number;
  alias: string;
  profile_image: string;
  name: string;
  first_name: string;
  last_name: string;
  email: string;
  user_type: string;
}

export interface ApiSupportTicket {
  alias: string;
  ticket_id: string;
  ticket_type: SupportTicketType;
  subject: string;
  status: SupportTicketStatus;
  priority: SupportTicketPriority;
  description: string;
  files: ApiSupportTicketFile[];
  created_at: string;
  created_by: ApiSupportTicketUser;
  organisation: string;
}

// Display/UI shape mapped from ApiSupportTicket
export interface SupportTicket {
  alias: string;
  ticketId: string;
  ticketType: SupportTicketType;
  subject: string;
  status: SupportTicketStatus;
  priority: SupportTicketPriority;
  description: string;
  fileCount: number;
  createdAt: string;
  createdByName: string;
  createdByEmail: string;
  createdByAvatar?: string;
  organisation: string;
}

export interface SupportTicketRowProps {
  ticket: SupportTicket;
  apiTicket: ApiSupportTicket;
  idx: number;
}

export interface SupportTicketTableProps {
  tickets: SupportTicket[];
  apiTickets: ApiSupportTicket[];
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
  ticket?: ApiSupportTicket;
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
  author: ApiSupportTicketUser;
  files: ApiSupportTicketFile[];
  replies: ApiSupportTicketComment[];
  created_at: string;
}
