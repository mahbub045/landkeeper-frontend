export type MtdTabValue = 'income-expenses' | 'finance-costs' | 'summary';

export interface MtdTabState {
  activeTab: MtdTabValue;
}

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

// Sign-off required before the annual summary can be downloaded
export interface MtdDeclarationForm {
  propertiesIncluded: boolean;
  entriesChecked: boolean;
  itemsFlagged: boolean;
  signatory: string;
  date: string;
  notes: string;
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

export interface DownloadSummaryCardProps {
  report: MtdReport | undefined;
}

export interface MtdPropertiesTableProps {
  selected: string[];
  // number_of_properties_included from the MTD report
  includedCount: number;
  onSelectedChange: (aliases: string[]) => void;
}

export type MtdDeclarationCheck =
  'propertiesIncluded' | 'entriesChecked' | 'itemsFlagged';
