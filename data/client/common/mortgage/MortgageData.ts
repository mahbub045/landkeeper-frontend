import { MortgageForm } from '@/types/client/Common/Mortgage/MortgageTypes';
import { File as FileDocumentIcon, FileText, ImageIcon } from 'lucide-react';

export const INTEREST_RATE_TYPE_OPTIONS = [
  { value: 'FIXED_RATE', label: 'Fixed Rate' },
  { value: 'VARIABLE_RATE', label: 'Variable Rate' },
  { value: 'TRACKER', label: 'Tracker' },
  { value: 'OFFSET', label: 'Offset' },
];

export const EMPTY_MORTGAGE_FORM: MortgageForm = {
  property: '',
  lender_name: '',
  interest_rate_type: '',
  interest_rate: '',
  interest_rate_expiry_date: '',
  outstanding_balance: '',
  monthly_payment: '',
  remaining_mortgage: '',
  epc_rating: '',
  epc_certificate_expiry_date: '',
  notes: '',
};

// ---------- helpers ----------

export const rateTypeLabel = (type?: string) =>
  type
    ? type
        .toLowerCase()
        .split('_')
        .map((w) => w[0]?.toUpperCase() + w.slice(1))
        .join(' ')
    : '—';

export const EPC_ORDER = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
export const isEpcAtRisk = (rating?: string) =>
  !!rating && EPC_ORDER.indexOf(rating.toUpperCase()) >= EPC_ORDER.indexOf('E');

export const fileMeta = (url: string) => {
  const name = decodeURIComponent(url.split('/').pop() ?? 'document');
  const ext = name.split('.').pop()?.toLowerCase() ?? '';
  const isImage = ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext);
  const isPdf = ext === 'pdf';
  return {
    name: name.length > 42 ? `${name.slice(0, 39)}…` : name,
    icon: isImage ? ImageIcon : isPdf ? FileText : FileDocumentIcon,
    kind: isPdf ? 'PDF' : isImage ? 'Image' : ext.toUpperCase() || 'File',
  };
};

export const exhibitLabel = (i: number) => String.fromCharCode(65 + i); // A, B, C…

export const epcStyles = (rating?: string) => {
  if (!rating) return 'bg-muted text-muted-foreground border-transparent';
  const index = EPC_ORDER.indexOf(rating.toUpperCase());
  if (index <= 2)
    return 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20 dark:text-emerald-400';
  if (index === 3)
    return 'bg-amber-500/10 text-amber-700 border-amber-500/20 dark:text-amber-400';
  return 'bg-destructive/10 text-destructive border-destructive/20';
};

export const expiryUrgencyStyles = (days: number | null) => {
  if (days === null) return 'text-muted-foreground';
  if (days <= 90) return 'text-destructive';
  if (days <= 180) return 'text-amber-600 dark:text-amber-400';
  return 'text-muted-foreground';
};
