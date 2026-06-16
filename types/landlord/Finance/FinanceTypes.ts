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
