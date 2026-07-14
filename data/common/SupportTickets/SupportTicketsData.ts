import {
  SupportTicketForm,
  SupportTicketType,
} from '@/types/common/SupportTickets/SupportTicketTypes';

export const TABLE_COLUMNS = [
  'Ticket ID',
  'Type',
  'Subject',
  'Organisation',
  'Created By',
  'Files',
  'Created At',
  'Actions',
];

// Badge styling per ticket type — adjust to match actual enum values from backend
export const TICKET_TYPE_STYLES: Record<SupportTicketType, string> = {
  BUG_REPORT: 'bg-red-100 text-red-700',
  FEATURE_REQUEST: 'bg-blue-100 text-blue-700',
  GENERAL_INQUIRY: 'bg-slate-100 text-slate-700',
  COMPLAINT: 'bg-orange-100 text-orange-700',
  OTHER: 'bg-muted text-muted-foreground',
};

export const TICKET_TYPE_LABELS: Record<SupportTicketType, string> = {
  BUG_REPORT: 'Bug Report',
  FEATURE_REQUEST: 'Feature Request',
  GENERAL_INQUIRY: 'General Inquiry',
  COMPLAINT: 'Complaint',
  OTHER: 'Other',
};

export const EMPTY_FORM: SupportTicketForm = {
  ticketType: '',
  subject: '',
  description: '',
};

export const TicketTypeOptions = [
  { value: 'BUG_REPORT', label: 'Bug Report' },
  { value: 'FEEDBACK', label: 'Feedback' },
  { value: 'FEATURE_REQUEST', label: 'Feature Request' },
] as const;
