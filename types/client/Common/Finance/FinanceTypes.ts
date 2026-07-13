export type TxCategory =
  | 'Insurance'
  | 'Repairs'
  | 'Mortgage Payment'
  | 'Rental Income'
  | 'Utilities'
  | 'Management Fee';

export interface Transaction {
  id: number;
  date: string;
  description: string;
  category: TxCategory;
  amount: number;
}

export interface TooltipProps {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}

export interface TransactionCategoryOption {
  value: string;
  label: string;
}

export interface TransactionForm {
  type: 'Income' | 'Expense';
  propertyId: string;
  category: string;
  amount: string;
  date: string;
  description: string;
}

export interface AddTransactionModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

// ── Real API shapes ─────────────────────────────────────────────────────────

export interface FinancePropertyRef {
  id: number;
  alias: string;
  property_name: string;
}

export type FinanceTxType = 'INCOME' | 'EXPENSE';

export interface FinanceReceiptFile {
  id: number;
  file: string;
  description: string | null;
};
export interface FinanceTransaction {
  alias: string;
  property: FinancePropertyRef;
  type: FinanceTxType;
  category: string;
  amount: string;
  date: string;
  description: string;
  receipt_files: FinanceReceiptFile[];
  created_at: string;
  updated_at: string;
}

export interface FinanceListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: FinanceTransaction[];
}

export interface UpdateTransactionDialogProps {
  transaction: FinanceTransaction | null;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export interface DeleteTransactionDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  transactionAlias: string;
  transactionDescription: string;
}