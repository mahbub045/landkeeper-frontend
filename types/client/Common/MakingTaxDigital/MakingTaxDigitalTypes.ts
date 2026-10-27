export type MtdTabValue =
  | 'properties'
  | 'income-expenses'
  | 'finance-costs'
  | 'transactions'
  | 'summary';

export type MtdSubmissionStatus = 'DRAFT' | 'READY' | 'SUBMITTED';

export type MtdPropertyBusiness = 'UK' | 'OVERSEAS' | 'BOTH';

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

export interface MtdTransaction {
  alias: string;
  date: string;
  property_alias: string;
  type: 'INCOME' | 'EXPENSE';
  category: string;
  description: string;
  amount: number;
  reference: string;
}

export interface MtdPropertyTotals {
  property: MtdProperty;
  income: number;
  expenses: number;
  financeCosts: number;
  profit: number;
}

export interface MtdTrends {
  income: number;
  expenses: number;
  profit: number;
  financeCosts: number;
  mortgageInterest: number;
  otherFinanceCosts: number;
  transactions: number;
  incomeTransactions: number;
  expenseTransactions: number;
  transactionValue: number;
}

// Everything recorded for one quarter of one tax year
export interface MtdPeriodData {
  income: MtdIncomeEntry[];
  expenses: MtdExpenseEntry[];
  financeCosts: MtdFinanceCost[];
  transactions: MtdTransaction[];
  trends: MtdTrends;
  lastUpdated: string;
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
