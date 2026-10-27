// Placeholder data until the MTD API is available. Swap these for RTK Query
// results; the tabs only depend on the shapes in MakingTaxDigitalTypes.
import {
  MtdExpenseEntry,
  MtdFinanceCost,
  MtdIncomeEntry,
  MtdPeriodData,
  MtdPortfolioTotals,
  MtdProperty,
  MtdPropertyTotals,
  MtdQuarter,
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

const BASE_INCOME: MtdIncomeEntry[] = [
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

const BASE_EXPENSES: MtdExpenseEntry[] = [
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

const BASE_FINANCE_COSTS: MtdFinanceCost[] = [
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

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const sum = (values: number[]) => values.reduce((a, b) => a + b, 0);

// Moves an ISO date forward by whole months, keeping the day
function shiftMonths(iso: string, months: number): string {
  const [year, month, day] = iso.split('-').map(Number);
  const total = year * 12 + (month - 1) + months;
  return `${Math.floor(total / 12)}-${String((total % 12) + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

const monthName = (iso: string) => MONTHS[Number(iso.slice(5, 7)) - 1];

export function getMtdPeriodData(
  quarter: string,
  taxYear: string,
): MtdPeriodData {
  const quarterIndex = Math.max(
    0,
    MTD_QUARTERS.findIndex((q) => q.value === quarter),
  );
  const yearsBack = Math.max(0, MTD_TAX_YEARS.indexOf(taxYear));
  const monthOffset = quarterIndex * 3 - yearsBack * 12;

  // Deterministic per-period variation; every multiplier is 1 for the base
  // period. The seed nudges entries differently so rows don't all scale alike.
  const factor = 1 + quarterIndex * 0.05 - yearsBack * 0.08;
  const vary = (amount: number, seed: number) => {
    const nudge = ((seed % 3) - 1) * quarterIndex * 0.02;
    return Math.round((amount * (factor + nudge)) / 10) * 10;
  };
  const shift = (iso: string) => shiftMonths(iso, monthOffset);
  const statementMonth = shift('2026-04-01');
  const evidence = `Mortgage statement ${monthName(statementMonth).slice(0, 3)} ${statementMonth.slice(0, 4)}`;

  const income = BASE_INCOME.map((entry, index) => ({
    ...entry,
    amount: vary(entry.amount, index),
    date: shift(entry.date),
  }));
  const expenses = BASE_EXPENSES.map((entry, index) => ({
    ...entry,
    amount: vary(entry.amount, index + 1),
    date: shift(entry.date),
  }));
  const financeCosts = BASE_FINANCE_COSTS.map((entry, index) => ({
    ...entry,
    mortgage_interest: vary(entry.mortgage_interest, index),
    other_finance_costs: vary(entry.other_finance_costs, index + 2),
    evidence,
  }));

  return {
    income,
    expenses,
    financeCosts,
  };
}

export function getPropertyName(alias: string): string {
  return MTD_PROPERTIES.find((p) => p.alias === alias)?.name ?? '—';
}

// Narrows a period to the properties selected in the properties table
export function filterPeriodByProperties(
  data: MtdPeriodData,
  aliases: string[],
): MtdPeriodData {
  const matches = (e: { property_alias: string }) =>
    aliases.includes(e.property_alias);
  return {
    income: data.income.filter(matches),
    expenses: data.expenses.filter(matches),
    financeCosts: data.financeCosts.filter(matches),
  };
}

// How totals are labelled, e.g. "all properties" or "Oak Cottage"
export function getScopeLabel(properties: MtdProperty[]): string {
  if (properties.length === 1) return properties[0].name;
  if (properties.length === MTD_PROPERTIES.length) return 'all properties';
  return `${properties.length} selected properties`;
}

// Residential finance costs get a separate tax treatment, so they are not
// deducted from profit here
export function getPropertyTotals(data: MtdPeriodData): MtdPropertyTotals[] {
  return MTD_PROPERTIES.map((property) => {
    const income = sum(
      data.income
        .filter((e) => e.property_alias === property.alias)
        .map((e) => e.amount),
    );
    const expenses = sum(
      data.expenses
        .filter((e) => e.property_alias === property.alias)
        .map((e) => e.amount),
    );
    return { property, income, expenses, profit: income - expenses };
  });
}

export function getPortfolioTotals(
  data: MtdPeriodData,
  propertyCount: number = MTD_PROPERTIES.length,
): MtdPortfolioTotals {
  const income = sum(data.income.map((e) => e.amount));
  const expenses = sum(data.expenses.map((e) => e.amount));
  const mortgageInterest = sum(
    data.financeCosts.map((e) => e.mortgage_interest),
  );
  const otherFinanceCosts = sum(
    data.financeCosts.map((e) => e.other_finance_costs),
  );
  return {
    income,
    expenses,
    profit: income - expenses,
    mortgageInterest,
    otherFinanceCosts,
    financeCosts: mortgageInterest + otherFinanceCosts,
    propertyCount,
  };
}
