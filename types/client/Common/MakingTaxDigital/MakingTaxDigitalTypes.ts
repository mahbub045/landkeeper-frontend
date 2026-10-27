export type MtdTabValue =
  'properties' | 'income-expenses' | 'finance-costs' | 'summary';

export interface MtdQuarter {
  value: string;
  label: string;
}

export interface MtdProperty {
  alias: string;
  name: string;
  address: string;
  property_type: string;
  ownership_share: number;
  letting_status: string;
}

export interface MtdIncomeEntry {
  alias: string;
  property_alias: string;
  income_type: string;
  amount: number;
  date: string;
}

export interface MtdExpenseEntry {
  alias: string;
  property_alias: string;
  category: string;
  amount: number;
  date: string;
}

export interface MtdFinanceCost {
  alias: string;
  property_alias: string;
  mortgage_interest: number;
  other_finance_costs: number;
  lender_reference: string;
  evidence: string;
}

export interface MtdPropertyTotals {
  property: MtdProperty;
  income: number;
  expenses: number;
  profit: number;
}

// Everything recorded for one quarter of one tax year
export interface MtdPeriodData {
  income: MtdIncomeEntry[];
  expenses: MtdExpenseEntry[];
  financeCosts: MtdFinanceCost[];
}

export interface MtdPortfolioTotals {
  income: number;
  expenses: number;
  profit: number;
  mortgageInterest: number;
  otherFinanceCosts: number;
  financeCosts: number;
  propertyCount: number;
}

// Sign-off required before the annual summary can be downloaded
export interface MtdDeclarationForm {
  propertiesIncluded: boolean;
  entriesChecked: boolean;
  itemsFlagged: boolean;
  signatory: string;
  date: string;
  notes: string;
}

export type MtdDeclarationCheck =
  'propertiesIncluded' | 'entriesChecked' | 'itemsFlagged';
