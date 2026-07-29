export interface PropertyAndTenancyDetailsType {
  id: string;
  address: string;
  city: string;
  term_start: string;
  term_end: string;
  term_length: string;
  status: 'Active' | 'Ending soon' | 'Expired';
}

export interface FinancialDataType {
  id: string;
  next_rent_due_date: string;
  outstanding_balance: number;
  is_paid_in_full: boolean;
  rent_amount: number;
  rent_cadence: 'month' | 'week';
}
