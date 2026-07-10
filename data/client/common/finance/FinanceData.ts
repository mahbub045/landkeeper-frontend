import {
  Transaction,
  TransactionCategoryOption,
  TransactionForm,
  TxCategory,
} from '@/types/client/Common/Finance/FinanceTypes';

export const monthlyData = [
  { month: 'Jan', income: 2600 },
  { month: 'Feb', income: 2620 },
  { month: 'Mar', income: 2550 },
  { month: 'Apr', income: 2540 },
  { month: 'May', income: 2680 },
  { month: 'Jun', income: 2700 },
];

export const transactions: Transaction[] = [
  {
    id: 1,
    date: '10/05/2026',
    description: 'Building insurance monthly',
    category: 'Insurance',
    amount: -45,
  },
  {
    id: 2,
    date: '15/05/2026',
    description: 'Plumbing repair',
    category: 'Repairs',
    amount: -350,
  },
  {
    id: 3,
    date: '01/05/2026',
    description: 'Barclays mortgage payment',
    category: 'Mortgage Payment',
    amount: -1650,
  },
  {
    id: 4,
    date: '01/05/2026',
    description: 'Commercial rent - David Clark',
    category: 'Rental Income',
    amount: 1500,
  },
  {
    id: 5,
    date: '01/05/2026',
    description: 'Santander mortgage payment',
    category: 'Mortgage Payment',
    amount: -720,
  },
  {
    id: 6,
    date: '01/05/2026',
    description: 'Monthly rent - Lisa Taylor',
    category: 'Rental Income',
    amount: 750,
  },
  {
    id: 7,
    date: '01/05/2026',
    description: 'Nationwide mortgage payment',
    category: 'Mortgage Payment',
    amount: -980,
  },
  {
    id: 8,
    date: '01/05/2026',
    description: 'Monthly rent - HMO tenants',
    category: 'Rental Income',
    amount: 1200,
  },
  {
    id: 9,
    date: '01/05/2026',
    description: 'Halifax mortgage payment',
    category: 'Mortgage Payment',
    amount: -1250,
  },
  {
    id: 10,
    date: '01/05/2026',
    description: 'Monthly rent - Sarah Johnson',
    category: 'Rental Income',
    amount: 850,
  },
];

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

export const TransactionCategoryOptions: TransactionCategoryOption[] = [
  { value: 'RENTAL_INCOME', label: 'Rental Income' },
  { value: 'MORTGAGE_PAYMENT', label: 'Mortgage Payment' },
  { value: 'REPAIRS', label: 'Repairs' },
  { value: 'INSURANCE', label: 'Insurance' },
  { value: 'SERVICE_CHARGES', label: 'Service Charges' },
  { value: 'UTILITIES', label: 'Utilities' },
  { value: 'MANAGEMENT_FEES', label: 'Management Fees' },
  { value: 'TAX', label: 'Tax' },
  { value: 'OTHER', label: 'Other' },
];

export const EMPTY_FORM: TransactionForm = {
  type: 'Income',
  propertyId: '',
  category: 'Rental Income',
  amount: '',
  date: '',
  description: '',
};
