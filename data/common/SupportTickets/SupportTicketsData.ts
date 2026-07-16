import {
  SupportTicketForm,
  SupportTicketType,
} from '@/types/common/SupportTickets/SupportTicketTypes';

export const TABLE_COLUMNS = [
  'Ticket ID',
  'Type',
  'Subject',
  'Created By',
  'Files',
  'Created At',
  'Actions',
];

// Badge styling per ticket type — adjust to match actual enum values from backend
export const TICKET_TYPE_STYLES: Record<SupportTicketType, string> = {
  FEEDBACK: 'bg-emerald-100 text-emerald-700',
  BUG_REPORT: 'bg-red-100 text-red-700',
  FEATURE_REQUEST: 'bg-blue-100 text-blue-700',
};

export const TICKET_TYPE_LABELS: Record<SupportTicketType, string> = {
  FEEDBACK: 'Feedback',
  BUG_REPORT: 'Bug Report',
  FEATURE_REQUEST: 'Feature Request',
};

export const EMPTY_FORM: SupportTicketForm = {
  ticketType: '',
  subject: '',
  description: '',
};

export const TicketTypeOptions = [
  { value: 'FEEDBACK', label: 'Feedback' },
  { value: 'BUG_REPORT', label: 'Bug Report' },
  { value: 'FEATURE_REQUEST', label: 'Feature Request' },
] as const;
