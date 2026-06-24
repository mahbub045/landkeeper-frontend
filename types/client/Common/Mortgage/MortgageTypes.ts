export interface Mortgage {
  id: number;
  property: string;
  lender: string;
  type: 'Fixed Rate' | 'Tracker' | 'Variable';
  renewalDue: boolean;
  interestRate: number;
  outstandingBalance: number;
  originalLoan: number;
  monthlyPayment: number;
  termRemainingMonths: number;
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
