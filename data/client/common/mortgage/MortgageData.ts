import { MortgageForm } from '@/types/client/Common/Mortgage/MortgageTypes';

export const INTEREST_RATE_TYPE_OPTIONS = [
  { value: 'FIXED_RATE', label: 'Fixed Rate' },
  { value: 'VARIABLE_RATE', label: 'Variable Rate' },
  { value: 'TRACKER', label: 'Tracker' },
  { value: 'OFFSET', label: 'Offset' },
];

export const EMPTY_MORTGAGE_FORM: MortgageForm = {
  propertyId: '',
  lenderName: '',
  interestRateType: '',
  interestRate: '',
  interestRateExpiryDate: '',
  outstandingBalance: '',
  monthlyPayment: '',
  remainingMortgage: '',
  epcRating: '',
  epcCertificateExpiryDate: '',
  notes: '',
};
