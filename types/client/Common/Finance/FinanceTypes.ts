export type TxCategory =
  | "Insurance"
  | "Repairs"
  | "Mortgage Payment"
  | "Rental Income"
  | "Utilities"
  | "Management Fee";

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
  properties?: { id: string; name: string }[];
}
