export type PaymentStatus =
  | 'cleared'
  | 'pending'
  | 'processing'
  | 'failed'
  | 'refunded';

export interface ApiRentBalanceSummary {
  current_rent_amount: number | null;
  outstanding_balance: number | null;
  next_due_date: string | null;
}

export type PaymentProvider = 'gocardless' | 'stripe';

export interface PaymentMethodOption {
  id: string;
  provider: PaymentProvider;
  title: string;
  description: string;
  ctaLabel: string;
  action: 'setup' | 'request-deduction';
}

export interface ApiPaymentMethod {
  alias: string;
  tenant: number;
  provider: 'GOCARDLESS' | 'STRIPE' | string;
  method_type: 'DIRECT_DEBIT' | 'CARD' | string;
  provider_customer_id: string | null;
  provider_mandate_id: string | null;
  provider_payment_method_id: string | null;
  status:
    | 'ACTIVE'
    | 'PENDING_SUBMISSION'
    | 'SUBMITTED'
    | 'FAILED'
    | 'CANCELLED'
    | string;
  is_default: boolean;
  card_last4: string | null;
  card_brand: string | null;
  created_at: string;
  updated_at: string;
}

export interface QuickPaymentCardProps {
  paymentMethods: PaymentMethodOption[];
  onSelectPaymentMethod: (method: PaymentMethodOption) => void;
  loadingMethodId?: string | null;
}

export interface StatementRequest {
  type: 'full-year' | 'custom-range';
  startDate?: string;
  endDate?: string;
}

export interface ApiRentPayment {
  alias: string;
  tenant: number;
  property: number;
  organisation: number;
  payment_method: ApiPaymentMethod | null;
  reference: string;
  amount: string;
  due_date: string;
  paid_date: string | null;
  status: 'PENDING' | 'CLEARED' | 'FAILED' | 'REFUNDED' | string;
  provider_payment_id: string | null;
  receipt_file: string | null;
  failure_reason: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateRentPaymentPayload {
  amount: string;
  due_date: string;
}

export interface PayWithCardPayload {
  rent_payment?: string;
  due_date: string;
  payment_method_id?: string;
  amount: string;
}

export interface PayWithCardResponse {
  client_secret: string;
  status: string;
}

export interface PayWithDirectDebitPayload {
  rent_payment: string;
}

export interface PayWithDirectDebitResponse {
  provider_payment_id: string;
  status: string;
}

export interface PaymentHistoryTableProps {
  payments: ApiRentPayment[];
}

export interface PayWithCardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export interface PayWithDirectDebitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export interface RentStatementPdfParams {
  period?: 'monthly';
  year?: number;
  month?: number;
}
