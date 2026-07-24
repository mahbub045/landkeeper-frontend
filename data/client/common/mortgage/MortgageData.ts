import { MortgageForm } from '@/types/client/Common/Mortgage/MortgageTypes';

export const INTEREST_RATE_TYPE_OPTIONS = [
  { value: 'FIXED_RATE', label: 'Fixed Rate' },
  { value: 'VARIABLE_RATE', label: 'Variable Rate' },
  { value: 'TRACKER', label: 'Tracker' },
  { value: 'OFFSET', label: 'Offset' },
];

export const EMPTY_MORTGAGE_FORM: MortgageForm = {
  property: '',
  lender_name: '',
  interest_rate_type: '',
  interest_rate: '',
  interest_rate_expiry_date: '',
  outstanding_balance: '',
  monthly_payment: '',
  remaining_mortgage: '',
  epc_rating: '',
  epc_certificate_expiry_date: '',
  notes: '',
};
