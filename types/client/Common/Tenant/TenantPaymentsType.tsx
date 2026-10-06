export interface TenantPaymentType {
  alias: string;
  tenant_id: number;
  tenant_name: string;
  tenant_alias: string;
  property_name: string;
  property_address: string;
  amount: string;
  due_date: string;
  status: 'CLEARED' | 'PENDING' | 'PROCESSING' | 'FAILED' | 'REFUNDED' | string;
  failure_reason: string | null;
  provider_payment_id: string | null;
  card_last4: string | null;
  card_brand: string | null;
  invoice_url: string | null;
  note: string | null;
  created_at: string;
  updated_at: string;
}
