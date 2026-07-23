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
  uploaded_documents: {
    id: number;
    file: string;
    description: string | null;
  }[];
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
  property: string;
  lender_name: string;
  interest_rate_type: string;
  interest_rate: string;
  interest_rate_expiry_date: string;
  outstanding_balance: string;
  monthly_payment: string;
  remaining_mortgage: string;
  epc_rating: string;
  epc_certificate_expiry_date: string;
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
