import { MortgageForm } from '@/types/client/Common/Mortgage/MortgageTypes';

export const PRODUCT_TYPE_OPTIONS = [
  { value: 'FIXED_RATE', label: 'Fixed Rate' },
  { value: 'VARIABLE_RATE', label: 'Variable Rate' },
  { value: 'TRACKER', label: 'Tracker' },
  { value: 'OFFSET', label: 'Offset' },
];

export const EMPTY_MORTGAGE_FORM: MortgageForm = {
  propertyId: '',
  lenderName: '',
  productType: '',
  interestRate: '',
  loanAmount: '',
  outstandingBalance: '',
  monthlyPayment: '',
  termYears: '',
  startDate: '',
  endDate: '',
  brokerNotes: '',
};