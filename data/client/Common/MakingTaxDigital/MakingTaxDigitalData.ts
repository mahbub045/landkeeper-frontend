import {
  MtdQuarter,
  MtdSummary,
} from '@/types/client/Common/MakingTaxDigital/MakingTaxDigitalTypes';

export const MTD_QUARTERS: MtdQuarter[] = [
  { value: 'Q1', label: 'Quarter 1 (6 Apr – 5 Jul)' },
  { value: 'Q2', label: 'Quarter 2 (6 Jul – 5 Oct)' },
  { value: 'Q3', label: 'Quarter 3 (6 Oct – 5 Jan)' },
  { value: 'Q4', label: 'Quarter 4 (6 Jan – 5 Apr)' },
];

export const MTD_TAX_YEARS = [
  {
    value: '2026',
    label: '2026/27',
  },
  {
    value: '2025',
    label: '2025/26',
  },
];

// The given value if it is one of the options, otherwise the first option
export function pickOption(
  options: { value: string }[],
  value: string | number | undefined,
): string {
  const match = options.find((o) => o.value === String(value));
  return (match ?? options[0]).value;
}

// Letting status pill colours, keyed by property status value
export const MTD_LETTING_STATUS_STYLES: Record<string, string> = {
  OCCUPIED:
    'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400',
  VACANT: 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400',
  UNDER_MAINTENANCE:
    'bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400',
};

// File extension for the downloaded summary, keyed by the response MIME type
export const MTD_DOWNLOAD_EXTENSIONS: Record<string, string> = {
  'application/pdf': 'pdf',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
  'text/csv': 'csv',
};

// How report totals are labelled, e.g. "all properties" or "2 selected properties"
export function getReportScopeLabel(
  report:
    | Pick<MtdSummary, 'number_of_properties_included' | 'total_properties'>
    | undefined,
): string {
  const included = report?.number_of_properties_included ?? 0;
  if (included > 0 && included === report?.total_properties)
    return 'all properties';
  return `${included} selected ${included === 1 ? 'property' : 'properties'}`;
}
