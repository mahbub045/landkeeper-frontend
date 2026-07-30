// NOTE: These types are placeholders based on the dummy data. Once the API
// payloads are shared, swap in the real `ApiXxx` shapes and add mapper
// functions (matching the ApiTenant -> Tenant pattern used elsewhere in
// LandKeeper) so components keep consuming a stable UI-facing shape.

export type PaymentStatus = "cleared" | "pending" | "processing" | "failed";

export interface RentSummary {
  currentRentAmount: number;
  rentFrequencyLabel: string; // e.g. "Per calendar month"
  nextDueDate: string; // ISO date string
  daysUntilDue: number;
  outstandingBalance: number;
  isAccountUpToDate: boolean;
}

export type PaymentProvider = "gocardless" | "stripe";

export interface PaymentMethodOption {
  id: string;
  provider: PaymentProvider;
  title: string;
  description: string;
  ctaLabel: string;
  action: "setup" | "manage";
}

// Raw shape returned by GET /tenant/payment-methods and the
// direct-debit/complete endpoint. Adjust as backend adds providers/fields.
export interface ApiPaymentMethod {
  alias: string;
  tenant: number;
  provider: "GOCARDLESS" | "STRIPE" | string;
  method_type: "DIRECT_DEBIT" | "CARD" | string;
  provider_customer_id: string | null;
  provider_mandate_id: string | null;
  provider_payment_method_id: string | null;
  status: "ACTIVE" | "PENDING_SUBMISSION" | "SUBMITTED" | "FAILED" | "CANCELLED" | string;
  is_default: boolean;
  card_last4: string | null;
  card_brand: string | null;
  created_at: string;
  updated_at: string;
}

export interface PaymentRecord {
  id: string;
  date: string; // ISO date string
  reference: string;
  amount: number;
  status: PaymentStatus;
  receiptUrl?: string | null;
}

export interface StatementRequest {
  type: "full-year" | "custom-range";
  startDate?: string;
  endDate?: string;
}