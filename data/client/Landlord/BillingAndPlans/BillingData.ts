export const cardBrandLabels: Record<string, string> = {
  visa: 'Visa',
  mastercard: 'Mastercard',
  amex: 'Amex',
  discover: 'Discover',
};

export const statusDotStyles: Record<string, string> = {
  PENDING: 'bg-amber-500',
  SUCCEEDED: 'bg-emerald-500',
  FAILED: 'bg-destructive',
  PARTIALLY_REFUNDED: 'bg-blue-400',
  REFUNDED: 'bg-blue-500',
};

export const statusBGStyles: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-800',
  SUCCEEDED: 'bg-emerald-100 text-emerald-800',
  FAILED: 'bg-destructive/10 text-destructive',
  PARTIALLY_REFUNDED: 'bg-blue-100 text-blue-800',
  REFUNDED: 'bg-blue-100 text-blue-800',
};
