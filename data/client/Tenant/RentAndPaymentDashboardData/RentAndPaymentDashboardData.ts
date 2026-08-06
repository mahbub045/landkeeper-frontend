import {
  PaymentMethodOption,
  PaymentProvider,
  PaymentStatus,
} from '@/types/client/Tenant/RentAndPayments/RentAndPaymentsType';
import {
  CheckCircle2,
  Clock,
  CreditCard,
  Landmark,
  Loader,
  LucideIcon,
  RotateCcw,
  XCircle,
} from 'lucide-react';

export const MONTHS = [
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' },
];

export const CURRENT_YEAR = new Date().getFullYear();
export const YEARS = Array.from({ length: 5 }, (_, i) => CURRENT_YEAR - i);

export const PROVIDER_ICON: Record<PaymentProvider, LucideIcon> = {
  gocardless: Landmark,
  stripe: CreditCard,
};

export const dummyPaymentMethods: PaymentMethodOption[] = [
  {
    id: 'gocardless',
    provider: 'gocardless',
    title: 'Set up Direct Debit',
    description:
      'Set up hassle-free, recurring monthly transfers directly from your bank account.',
    ctaLabel: 'Set Up Direct Debit',
    action: 'setup',
  },
  {
    id: 'stripe',
    provider: 'stripe',
    title: 'Pay with Card',
    description: 'Pay instantly using a credit or debit card.',
    ctaLabel: 'Pay with Card',
    action: 'setup',
  },
];

export const STATUS_CONFIG: Record<
  PaymentStatus,
  { label: string; icon: LucideIcon; className: string }
> = {
  cleared: {
    label: 'Cleared',
    icon: CheckCircle2,
    className: 'border-green-200 bg-green-50 text-green-700',
  },
  pending: {
    label: 'Pending',
    icon: Clock,
    className: 'border-amber-200 bg-amber-50 text-amber-700',
  },
  processing: {
    label: 'Processing',
    icon: Loader,
    className: 'border-blue-200 bg-blue-50 text-blue-700',
  },
  failed: {
    label: 'Failed',
    icon: XCircle,
    className: 'border-red-200 bg-red-50 text-red-700',
  },
  refunded: {
    label: 'Refunded',
    icon: RotateCcw,
    className: 'border-slate-200 bg-slate-50 text-slate-700',
  },
};

export const PAYMENT_METHOD_PROVIDER_CONFIG: Record<
  string,
  { label: string; icon: LucideIcon }
> = {
  GOCARDLESS: { label: 'GoCardless', icon: Landmark },
  STRIPE: { label: 'Stripe', icon: CreditCard },
};

export const PAYMENT_METHOD_TYPE_LABEL: Record<string, string> = {
  DIRECT_DEBIT: 'Direct Debit',
  CARD: 'Card',
};

export function normalizePaymentStatus(status: string): PaymentStatus {
  switch (status.toUpperCase()) {
    case 'CLEARED':
      return 'cleared';
    case 'PENDING':
      return 'pending';
    case 'PROCESSING':
      return 'processing';
    case 'FAILED':
      return 'failed';
    case 'REFUNDED':
      return 'refunded';
    default:
      return 'pending';
  }
}
