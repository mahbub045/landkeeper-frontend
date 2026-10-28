import {
  TransactionForm,
  TxCategory,
} from '@/types/client/Common/Finance/FinanceTypes';

export const categoryStyles: Record<TxCategory, string> = {
  Insurance: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
  Repairs: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
  'Mortgage Payment':
    'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
  'Rental Income':
    'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
  Utilities:
    'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
  'Management Fee':
    'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
};

export const EMPTY_FORM: TransactionForm = {
  type: '',
  propertyId: '',
  category: '',
  otherCategory: '',
  amount: '',
  date: '',
  description: '',
};
