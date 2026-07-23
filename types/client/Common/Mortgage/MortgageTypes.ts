export interface Mortgage {
  alias: string;
  property: {
    id: number;
    alias: string;
    property_name: string;
  };
  lender_name: string;
  interest_rate_type:
    | 'FIXED_RATE'
    | 'VARIABLE_RATE'
    | 'INTEREST_ONLY'
    | 'TRACKER';
  interest_rate: string | null;
  interest_rate_expiry_date: string;
  loan_amount: string | null;
  outstanding_balance: string | null;
  monthly_payment: string | null;
  remaining_mortgage: string;
  epc_rating: string | null;
  epc_certificate_expiry_date: string;
  notes: string;
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
  interestRateType: string;
  interestRate: string;
  interestRateExpiryDate: string;
  outstandingBalance: string;
  monthlyPayment: string;
  remainingMortgage: string;
  epcRating: string;
  epcCertificateExpiryDate: string;
  notes: string;
}

export interface AddMortgageDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  properties?: { id: string; name: string }[];
}

export interface UpdateMortgageDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  mortgage: Mortgage;
}

export interface DeleteMortgageDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  mortgageAlias: string;
}
