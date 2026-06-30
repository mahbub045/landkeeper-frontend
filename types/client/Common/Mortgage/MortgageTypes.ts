export interface Mortgage {
  alias: string;
  property: number;
  lender_name: string;
  product_type: 'FIXED_RATE' | 'VARIABLE_RATE' | 'INTEREST_ONLY' | 'TRACKER';
  interest_rate: string | null;
  loan_amount: string | null;
  outstanding_balance: string | null;
  monthly_payment: string | null;
  term: number;
  start_date: string;
  end_date: string;
  broker_notes: string;
  created_at: string;
  updated_at: string;
}
export interface SummaryStat {
  label: string;
  value: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
}

export interface MortgageCardProps {
  mortgage: Mortgage;
}

export interface MortgageForm {
  propertyId: string;
  lenderName: string;
  productType: string;
  interestRate: string;
  loanAmount: string;
  outstandingBalance: string;
  monthlyPayment: string;
  termYears: string;
  startDate: string;
  endDate: string;
  brokerNotes: string;
}

export interface AddMortgageModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  // Pass your properties list here so the dropdown can be populated
  properties?: { id: string; name: string }[];
}
