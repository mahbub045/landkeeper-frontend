export interface MortgagePropertyType {
  alias: string;
  property: {
    id: number;
    alias: string;
    property_name: string;
  };
  lender_name: string;
  interest_rate_type: 'FIXED_RATE' | string;
  interest_rate: number;
  interest_rate_expiry_date: Date | null;
  outstanding_balance: number;
  monthly_payment: number;
  remaining_mortgage: number;
  epc_rating: string;
  epc_certificate_expiry_date: Date | null;
  notes: string;
  uploaded_documents: UploadedDocument[];
  created_at: string;
  updated_at: string;
}

interface UploadedDocument {
  id: number;
  file: string;
  description: string | null;
}
