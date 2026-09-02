import {
  SupportTicketForm,
  SupportTicketPriority,
  SupportTicketStatus,
  SupportTicketType,
} from '@/types/common/SupportTickets/SupportTicketTypes';
import { Check, CheckCheck, CircleAlert, Loader, X } from 'lucide-react';

export const TABLE_COLUMNS = [
  'Ticket ID',
  'Status',
  'Type',
  'Priority',
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

export const PRIORITY_STYLES: Record<SupportTicketPriority, string> = {
  URGENT: 'bg-red-100 text-red-700',
  MEDIUM: 'bg-orange-100 text-orange-700',
  NORMAL: 'bg-blue-100 text-blue-700',
  WHEN_POSSIBLE: 'bg-slate-100 text-slate-700',
};

export const STATUS_STYLES: Record<SupportTicketStatus, string> = {
  OPEN: 'bg-rose-100 text-rose-700',
  IN_PROGRESS: 'bg-amber-100 text-amber-700',
  COMPLETED: 'bg-blue-100 text-blue-700',
  RESOLVED: 'bg-emerald-100 text-emerald-700',
  CLOSED: 'bg-gray-200 text-gray-700',
};

export const STATUS_LABELS: Record<SupportTicketStatus, string> = {
  OPEN: 'Open',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  RESOLVED: 'Resolved',
  CLOSED: 'Closed',
};

export const STATUS_ICONS: Record<SupportTicketStatus, React.ElementType> = {
  OPEN: CircleAlert,
  IN_PROGRESS: Loader,
  COMPLETED: Check,
  RESOLVED: CheckCheck,
  CLOSED: X,
};

export const STATUS_ICON_COLORS: Record<SupportTicketStatus, string> = {
  OPEN: 'text-rose-700',
  IN_PROGRESS: 'text-amber-700',
  COMPLETED: 'text-blue-700',
  RESOLVED: 'text-emerald-700',
  CLOSED: 'text-neutral-700',
};

// Solid pill style for the interactive trigger (admin view)
export const STATUS_PILL_STYLES: Record<SupportTicketStatus, string> = {
  OPEN: 'bg-rose-400 text-white',
  IN_PROGRESS: 'bg-amber-400 text-white',
  COMPLETED: 'bg-sky-400 text-white',
  RESOLVED: 'bg-emerald-500 text-white',
  CLOSED: 'bg-neutral-900 text-white',
};

// Small dot color shown next to each option in the dropdown list
export const STATUS_DOT_COLORS: Record<SupportTicketStatus, string> = {
  OPEN: 'bg-rose-400',
  IN_PROGRESS: 'bg-amber-400',
  COMPLETED: 'bg-sky-400',
  RESOLVED: 'bg-emerald-500',
  CLOSED: 'bg-neutral-600',
};

export const EMPTY_FORM: SupportTicketForm = {
  ticketType: '',
  priority: '',
  subject: '',
  description: '',
};
export const TicketTypeOptions = [
  { value: 'FEEDBACK', label: 'Feedback' },
  { value: 'BUG_REPORT', label: 'Bug Report' },
  { value: 'FEATURE_REQUEST', label: 'Feature Request' },
] as const;

export const PriorityOptions = [
  { value: 'URGENT', label: 'Urgent' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'NORMAL', label: 'Normal' },
  { value: 'WHEN_POSSIBLE', label: 'When Possible' },
] as const;

export const PRIORITY_LABELS: Record<SupportTicketPriority, string> =
  PriorityOptions.reduce(
    (acc, opt) => ({ ...acc, [opt.value]: opt.label }),
    {} as Record<SupportTicketPriority, string>,
  );

export const StatusOptions = [
  { value: 'OPEN', label: 'Open' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'RESOLVED', label: 'Resolved' },
  { value: 'CLOSED', label: 'Closed' },
] as const;

export const STATUS_DESCRIPTIONS: Record<string, string> = {
  OPEN: 'Ticket has been submitted and is awaiting action.',
  IN_PROGRESS: 'Ticket is currently being worked on by our team.',
  COMPLETED: 'The issue has been fixed and is under review.',
  RESOLVED: 'The issue has been fixed and everything is working.',
  CLOSED: 'The ticket has been closed and no further action is required.',
};

export const STATUS_CONTROL_OPTIONS: Array<{
  value: SupportTicketStatus;
  label: string;
}> = Object.entries(STATUS_LABELS).map(([value, label]) => ({
  value: value as SupportTicketStatus,
  label,
}));
