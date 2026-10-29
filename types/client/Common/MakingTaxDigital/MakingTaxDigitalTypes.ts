export type MtdTabValue = 'income-expenses' | 'finance-costs' | 'summary';

export interface MtdQuarter {
  value: string;
  label: string;
}

// One report per tax year + quarter, from GET /mtd/reports
export interface MtdReport {
  alias: string;
  current_tax_year: number;
  current_quarter: string;
  tax_year: number;
  quarter: string;
  properties: string[];
  total_income: number;
  total_allowable_expenses: number;
  property_profit: number;
  total_mortgage_interest: number;
  total_properties: number;
  number_of_properties_included: number;
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

// Everything recorded for one quarter of one tax year
export interface MtdPeriodData {
  income: MtdIncomeEntry[];
  expenses: MtdExpenseEntry[];
  financeCosts: MtdFinanceCost[];
}

export interface MtdPropertyTotals {
  property: MtdProperty;
  income: number;
  expenses: number;
  profit: number;
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

// Shared by every tab; `properties` are the ones ticked in the properties table
export interface MtdTabProps {
  data: MtdPeriodData;
  properties: MtdProperty[];
  onPending: (label: string) => void;
}

// Totals from GET /mtd/reports/{alias}/summary
export interface MtdSummary {
  total_rental_income: number;
  total_other_income: number;
  total_income: number;
  total_allowable_expenses: number;
  property_profit: number;
  total_mortgage_interest: number;
  total_properties: number;
  number_of_properties_included: number;
}

// One income or expense line from GET /mtd/reports/{alias}/income-expenses
export interface MtdTransaction {
  alias: string;
  property_name: string;
  type: 'INCOME' | 'EXPENSE';
  category: string;
  amount: string;
  date: string;
}

export interface MtdIncomeExpenses {
  income: MtdTransaction[];
  expenses: MtdTransaction[];
}

export interface MtdEvidenceFile {
  id: string;
  name: string;
}

// One finance cost from GET /mtd/reports/{alias}/finance-costs
export interface MtdFinanceCostItem {
  alias: string;
  property_name: string;
  lender_name: string;
  monthly_payment: number | null;
  notes: string | null;
  evidence: MtdEvidenceFile[];
}

export interface MtdFinanceCosts {
  finance_costs: MtdFinanceCostItem[];
}

export interface EditFinanceCostDialogProps {
  reportAlias: string | undefined;
  financeCost: MtdFinanceCostItem | null;
  open: boolean;
  onClose: () => void;
}

export interface EditFinanceCostFormProps {
  reportAlias: string;
  financeCost: MtdFinanceCostItem;
  onClose: () => void;
}

// Tabs that load their own rows for the current report
export interface MtdReportTabProps {
  report: MtdReport | undefined;
  onPending: (label: string) => void;
}

export interface MtdPropertiesTableProps {
  rows: MtdPropertyTotals[];
  selected: string[];
  // number_of_properties_included from the MTD report
  includedCount: number;
  onSelectedChange: (aliases: string[]) => void;
}

export type MtdDeclarationCheck =
  'propertiesIncluded' | 'entriesChecked' | 'itemsFlagged';
