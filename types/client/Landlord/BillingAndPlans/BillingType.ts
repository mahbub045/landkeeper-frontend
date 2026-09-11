export interface SubscriptionFeature {
  code: string;
  name: string;
  description: string;
}

export interface SubscriptionPlan {
  alias: string;
  name: string;
  plan_type: 'BASIC' | 'STANDARD' | 'PREMIUM' | string;
  monthly_price: string;
  max_properties: number;
  referral_discount_percent: string;
  description: string;
  features: SubscriptionFeature[];
  is_active: boolean;
}

export type SubscriptionStatus =
  'PENDING' | 'ACTIVE' | 'TRIALING' | 'PAST_DUE' | 'CANCELLED' | 'EXPIRED';

export interface SubscriptionDetails {
  status: SubscriptionStatus;
  plan: SubscriptionPlan;
  start_date: string;
  end_date: string | null;
  next_billing_date: string | null;
  auto_renew: boolean;
  cancelled_at: string | null;
}

export interface BillingHistoryItem {
  alias: string;
  plan_name: string;
  amount: string;
  currency: string;
  status: string;
  attempt_number: number;
  created_at: string;
  invoice_pdf_url: string;
}

export interface BillingHistoryResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: BillingHistoryItem[];
}

export interface PaymentMethod {
  id: string;
  card_brand: string;
  last_four: string;
  expiry_month: number;
  expiry_year: number;
  is_default: boolean;
}
