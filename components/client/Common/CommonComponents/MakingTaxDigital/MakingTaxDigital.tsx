'use client';

import {
  ArrowLeftRight,
  BarChart3,
  CirclePlus,
  CreditCard,
  Download,
  FileText,
  Home,
  Landmark,
  PoundSterling,
  Wallet,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  getMtdPeriodData,
  getPortfolioTotals,
  sum,
} from '@/data/client/Common/MakingTaxDigital/MakingTaxDigitalData';
import {
  MtdPeriodData,
  MtdTabValue,
} from '@/types/client/Common/MakingTaxDigital/MakingTaxDigitalTypes';
import {
  MtdStat,
  MtdStatCards,
  QuickAction,
  toAmount,
} from './Shared/MtdShared';
import ReportingPeriod from './Shared/ReportingPeriod';
import FinanceCostsTab from './Tabs/FinanceCostsTab';
import IncomeExpensesTab from './Tabs/IncomeExpensesTab';
import PropertiesTab from './Tabs/PropertiesTab';
import SummaryTab from './Tabs/SummaryTab';
import TransactionsTab from './Tabs/TransactionsTab';

const TABS: { value: MtdTabValue; label: string }[] = [
  { value: 'properties', label: 'Properties' },
  { value: 'income-expenses', label: 'Income & Expenses' },
  { value: 'finance-costs', label: 'Finance Costs' },
  { value: 'transactions', label: 'Transactions' },
  { value: 'summary', label: 'Summary' },
];

function getStats(tab: MtdTabValue, data: MtdPeriodData): MtdStat[] {
  const totals = getPortfolioTotals(data);
  const propertiesStat: MtdStat = {
    icon: Home,
    label: 'Properties included',
    value: String(totals.propertyCount),
    caption: 'All properties selected',
    tone: 'neutral',
  };

  if (tab === 'finance-costs') {
    return [
      {
        icon: Wallet,
        label: 'Total finance costs',
        value: toAmount(totals.financeCosts),
        trend: data.trends.financeCosts,
      },
      {
        icon: FileText,
        label: 'Total mortgage interest',
        value: toAmount(totals.mortgageInterest),
        trend: data.trends.mortgageInterest,
      },
      {
        icon: Landmark,
        label: 'Total other finance costs',
        value: toAmount(totals.otherFinanceCosts),
        trend: data.trends.otherFinanceCosts,
      },
      propertiesStat,
    ];
  }

  if (tab === 'transactions') {
    const income = data.transactions.filter((t) => t.type === 'INCOME');
    const expenses = data.transactions.filter((t) => t.type === 'EXPENSE');
    return [
      {
        icon: ArrowLeftRight,
        label: 'Total transactions',
        value: String(data.transactions.length),
        trend: data.trends.transactions,
      },
      {
        icon: FileText,
        label: 'Total income transactions',
        value: String(income.length),
        trend: data.trends.incomeTransactions,
      },
      {
        icon: CreditCard,
        label: 'Total expense transactions',
        value: String(expenses.length),
        trend: data.trends.expenseTransactions,
      },
      {
        icon: PoundSterling,
        label: 'Total value',
        value: toAmount(sum(data.transactions.map((t) => t.amount))),
        trend: data.trends.transactionValue,
      },
    ];
  }

  return [
    {
      icon: Wallet,
      label: 'Total rental income',
      value: toAmount(totals.income),
      trend: data.trends.income,
    },
    {
      icon: FileText,
      label: 'Total allowable expenses',
      value: toAmount(totals.expenses),
      trend: data.trends.expenses,
    },
    {
      icon: BarChart3,
      label: 'Property profit / (loss)',
      value: toAmount(totals.profit),
      trend: data.trends.profit,
    },
    propertiesStat,
  ];
}

const MakingTaxDigital: React.FC = () => {
  const [tab, setTab] = useState<MtdTabValue>('properties');
  const [quarter, setQuarter] = useState('Q1');
  const [taxYear, setTaxYear] = useState('2026/27');
  const data = useMemo(
    () => getMtdPeriodData(quarter, taxYear),
    [quarter, taxYear],
  );

  // Actions that need the MTD API; replace with real handlers once it exists
  const onPending = (label: string) =>
    toast.info(`${label} will be available soon.`);

  const manageProperties: QuickAction = {
    icon: Home,
    title: 'Manage properties',
    description: 'Edit property details and settings',
    onClick: () => setTab('properties'),
  };
  const downloadReport: QuickAction = {
    icon: Download,
    title: 'Download report',
    description: 'Export your MTD summary',
    onClick: () => onPending('Download report'),
  };
  const transactionActions: QuickAction[] = [
    {
      icon: CirclePlus,
      title: 'Add transaction',
      description: 'Record a new income or expense',
      onClick: () => onPending('Add transaction'),
    },
    {
      icon: FileText,
      title: 'View all transactions',
      description: 'Browse your transaction records',
      onClick: () => setTab('transactions'),
    },
    manageProperties,
    downloadReport,
  ];
  const financeCostActions: QuickAction[] = [
    {
      icon: CirclePlus,
      title: 'Add finance cost',
      description: 'Record a new finance cost for a property',
      onClick: () => onPending('Add finance cost'),
    },
    {
      icon: FileText,
      title: 'View all finance costs',
      description: 'Browse your finance cost records',
      onClick: () => setTab('finance-costs'),
    },
    manageProperties,
    downloadReport,
  ];
  const summaryActions: QuickAction[] = [
    {
      icon: CirclePlus,
      title: 'Edit summary',
      description: 'Update your MTD summary details',
      onClick: () => setTab('income-expenses'),
    },
    {
      icon: FileText,
      title: 'View full report',
      description: 'See a detailed breakdown of all figures',
      onClick: () => setTab('income-expenses'),
    },
    {
      ...downloadReport,
      description: 'Export your MTD summary as a PDF',
    },
    manageProperties,
  ];

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-foreground text-2xl font-bold tracking-tight'>
          Making Tax Digital (MTD)
        </h1>
        <p className='text-muted-foreground text-sm'>
          Manage your quarterly updates and annual summary for Making Tax
          Digital.
        </p>
      </div>

      <Tabs
        value={tab}
        onValueChange={(value) => setTab(value as MtdTabValue)}
        className='gap-6'
      >
        <ReportingPeriod
          quarter={quarter}
          taxYear={taxYear}
          onQuarterChange={setQuarter}
          onTaxYearChange={setTaxYear}
          status='DRAFT'
          lastUpdated={data.lastUpdated}
        />

        <MtdStatCards stats={getStats(tab, data)} />

        <div className='border-border scrollbar-none overflow-x-auto overflow-y-hidden border-b pb-1.25 [&::-webkit-scrollbar]:hidden'>
          <TabsList variant='line' className='h-10! gap-2'>
            {TABS.map((t) => (
              <TabsTrigger
                key={t.value}
                value={t.value}
                className='cursor-pointer px-3 after:bg-blue-600 data-active:text-blue-700 dark:data-active:text-blue-400'
              >
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value='properties'>
          <PropertiesTab data={data} onPending={onPending} />
        </TabsContent>
        <TabsContent value='income-expenses'>
          <IncomeExpensesTab
            data={data}
            onNavigate={setTab}
            onPending={onPending}
          />
        </TabsContent>
        <TabsContent value='finance-costs'>
          <FinanceCostsTab
            data={data}
            quickActions={financeCostActions}
            onPending={onPending}
          />
        </TabsContent>
        <TabsContent value='transactions'>
          <TransactionsTab
            data={data}
            quickActions={transactionActions}
            onPending={onPending}
          />
        </TabsContent>
        <TabsContent value='summary'>
          <SummaryTab
            data={data}
            quickActions={summaryActions}
            onPending={onPending}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MakingTaxDigital;
