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