// Placeholder data until the MTD API is available. Swap these for RTK Query
// results; the tabs only depend on the shapes in MakingTaxDigitalTypes.
import {
  MtdExpenseEntry,
  MtdFinanceCost,
  MtdIncomeEntry,
  MtdProperty,
  MtdPropertyTotals,
  MtdQuarter,
  MtdTransaction,
} from '@/types/client/Common/MakingTaxDigital/MakingTaxDigitalTypes';

export const MTD_QUARTERS: MtdQuarter[] = [
  { value: 'Q1', label: 'Quarter 1 (6 Apr – 5 Jul)' },
  { value: 'Q2', label: 'Quarter 2 (6 Jul – 5 Oct)' },
  { value: 'Q3', label: 'Quarter 3 (6 Oct – 5 Jan)' },
  { value: 'Q4', label: 'Quarter 4 (6 Jan – 5 Apr)' },
];

export const MTD_TAX_YEARS = ['2026/27', '2025/26', '2024/25'];

export const MTD_PROPERTIES: MtdProperty[] = [
  {
    alias: 'riverside-view',
    name: 'Riverside View',
    address: '12 Riverside Road, Manchester, M1 2AB',
    property_type: 'Residential',
    ownership_share: 100,
    letting_status: 'Let',
  },
  {
    alias: 'oak-cottage',
    name: 'Oak Cottage',
    address: 'Oak Lane, Leeds, LS6 4PX',
    property_type: 'Residential',
    ownership_share: 100,
    letting_status: 'Let',
  },
  {
    alias: 'maple-house',
    name: 'Maple House',
    address: '8 Maple Street, Bristol, BS1 5TJ',
    property_type: 'Residential',
    ownership_share: 100,
    letting_status: 'Let',
  },
];

export const MTD_INCOME: MtdIncomeEntry[] = [
  {
    alias: 'inc-1',
    property_alias: 'riverside-view',
    income_type: 'Rent',
    amount: 2500,
    date: '2026-04-12',
  },
  {
    alias: 'inc-2',
    property_alias: 'oak-cottage',
    income_type: 'Rent',
    amount: 3000,
    date: '2026-04-08',
  },
  {
    alias: 'inc-3',
    property_alias: 'maple-house',
    income_type: 'Rent',
    amount: 3250,
    date: '2026-04-05',
  },
];

export const MTD_EXPENSES: MtdExpenseEntry[] = [
  {
    alias: 'exp-1',
    property_alias: 'riverside-view',
    category: 'Repairs & maintenance',
    amount: 690,
    date: '2026-04-10',
  },
  {
    alias: 'exp-2',
    property_alias: 'oak-cottage',
    category: 'Insurance',
    amount: 620,
    date: '2026-04-08',
  },
  {
    alias: 'exp-3',
    property_alias: 'maple-house',
    category: 'Management fees',
    amount: 480,
    date: '2026-04-05',
  },
  {
    alias: 'exp-4',
    property_alias: 'riverside-view',
    category: 'Utilities',
    amount: 310,
    date: '2026-04-12',
  },
  {
    alias: 'exp-5',
    property_alias: 'oak-cottage',
    category: 'Other expenses',
    amount: 580,
    date: '2026-04-15',
  },
  {
    alias: 'exp-6',
    property_alias: 'maple-house',
    category: 'Repairs & maintenance',
    amount: 530,
    date: '2026-04-20',
  },
];

export const MTD_FINANCE_COSTS: MtdFinanceCost[] = [
  {
    alias: 'fc-1',
    property_alias: 'riverside-view',
    mortgage_interest: 850,
    other_finance_costs: 60,
    lender_reference: 'HSBC (Ref: 123456)',
    evidence: 'Mortgage statement Apr 2026',
  },
  {
    alias: 'fc-2',
    property_alias: 'oak-cottage',
    mortgage_interest: 620,
    other_finance_costs: 80,
    lender_reference: 'Barclays (Ref: 654321)',
    evidence: 'Mortgage statement Apr 2026',
  },
  {
    alias: 'fc-3',
    property_alias: 'maple-house',
    mortgage_interest: 300,
    other_finance_costs: 110,
    lender_reference: 'Lloyds (Ref: 987654)',
    evidence: 'Mortgage statement Apr 2026',
  },
];

export const MTD_TRANSACTIONS: MtdTransaction[] = [
  ...MTD_INCOME.map((entry, index) => ({
    alias: entry.alias,
    date: entry.date,
    property_alias: entry.property_alias,
    type: 'INCOME' as const,
    category: entry.income_type,
    description: 'Rent payment – April',
    amount: entry.amount,
    reference: `R-${String(123 + index).padStart(5, '0')}`,
  })),
  ...MTD_EXPENSES.map((entry, index) => ({
    alias: entry.alias,
    date: entry.date,
    property_alias: entry.property_alias,
    type: 'EXPENSE' as const,
    category: entry.category,
    description: entry.category,
    amount: entry.amount,
    reference: `E-${String(45 + index).padStart(5, '0')}`,
  })),
].sort((a, b) => a.date.localeCompare(b.date));

export const MTD_LAST_UPDATED = '2026-04-14T10:24:00';

// Percentage change against the previous quarter, keyed by metric
export const MTD_TRENDS = {
  income: 12,
  expenses: 8,
  profit: 16,
  financeCosts: 12,
  transactions: 5,
};

export const sum = (values: number[]) => values.reduce((a, b) => a + b, 0);

export function getPropertyName(alias: string): string {
  return MTD_PROPERTIES.find((p) => p.alias === alias)?.name ?? '—';
}

export function getPropertyTotals(): MtdPropertyTotals[] {
  return MTD_PROPERTIES.map((property) => {
    const income = sum(
      MTD_INCOME.filter((e) => e.property_alias === property.alias).map(
        (e) => e.amount,
      ),
    );
    const expenses = sum(
      MTD_EXPENSES.filter((e) => e.property_alias === property.alias).map(
        (e) => e.amount,
      ),
    );
    const financeCosts = sum(
      MTD_FINANCE_COSTS.filter((e) => e.property_alias === property.alias).map(
        (e) => e.mortgage_interest + e.other_finance_costs,
      ),
    );
    // Residential finance costs get a separate tax treatment, so they are
    // not deducted from profit here
    return {
      property,
      income,
      expenses,
      financeCosts,
      profit: income - expenses,
    };
  });
}

export function getPortfolioTotals() {
  const income = sum(MTD_INCOME.map((e) => e.amount));
  const expenses = sum(MTD_EXPENSES.map((e) => e.amount));
  const mortgageInterest = sum(
    MTD_FINANCE_COSTS.map((e) => e.mortgage_interest),
  );
  const otherFinanceCosts = sum(
    MTD_FINANCE_COSTS.map((e) => e.other_finance_costs),
  );
  return {
    income,
    expenses,
    profit: income - expenses,
    mortgageInterest,
    otherFinanceCosts,
    financeCosts: mortgageInterest + otherFinanceCosts,
    propertyCount: MTD_PROPERTIES.length,
  };
}
