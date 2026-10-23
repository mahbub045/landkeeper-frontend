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
import { useState } from 'react';
import { toast } from 'sonner';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MtdTabValue } from '@/types/client/Common/MakingTaxDigital/MakingTaxDigitalTypes';
import {
  getPortfolioTotals,
  MTD_LAST_UPDATED,
  MTD_TRANSACTIONS,
  MTD_TRENDS,
  sum,
} from './mtdData';
import {
  MtdStat,
  MtdStatCards,
  QuickAction,
  toAmount,
} from './Shared/MtdShared';
import ReportingPeriod from './Shared/ReportingPeriod';
import FinanceCostsTab from './Tabs/FinanceCostsTab';
import IncomeExpensesTab from './Tabs/IncomeExpensesTab';
import OverviewTab from './Tabs/OverviewTab';
import PropertiesTab from './Tabs/PropertiesTab';
import SummaryTab from './Tabs/SummaryTab';
import TransactionsTab from './Tabs/TransactionsTab';

const TABS: { value: MtdTabValue; label: string }[] = [
  { value: 'overview', label: 'Overview' },
  { value: 'income-expenses', label: 'Income & Expenses' },
  { value: 'properties', label: 'Properties' },
  { value: 'finance-costs', label: 'Finance Costs' },
  { value: 'transactions', label: 'Transactions' },
  { value: 'summary', label: 'Summary' },
];

function getStats(tab: MtdTabValue): MtdStat[] {
  const totals = getPortfolioTotals();
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
        trend: MTD_TRENDS.financeCosts,
      },
      {
        icon: FileText,
        label: 'Total mortgage interest',
        value: toAmount(totals.mortgageInterest),
        trend: 10,
      },
      {
        icon: Landmark,
        label: 'Total other finance costs',
        value: toAmount(totals.otherFinanceCosts),
        trend: 8,
      },
      propertiesStat,
    ];
  }

  if (tab === 'transactions') {
    const income = MTD_TRANSACTIONS.filter((t) => t.type === 'INCOME');
    const expenses = MTD_TRANSACTIONS.filter((t) => t.type === 'EXPENSE');
    return [
      {
        icon: ArrowLeftRight,
        label: 'Total transactions',
        value: String(MTD_TRANSACTIONS.length),
        trend: MTD_TRENDS.transactions,
      },
      {
        icon: FileText,
        label: 'Total income transactions',
        value: String(income.length),
        trend: 9,
      },
      {
        icon: CreditCard,
        label: 'Total expense transactions',
        value: String(expenses.length),
        trend: 2,
      },
      {
        icon: PoundSterling,
        label: 'Total value',
        value: toAmount(sum(MTD_TRANSACTIONS.map((t) => t.amount))),
        trend: 7,
      },
    ];
  }

  return [
    {
      icon: Wallet,
      label: 'Total rental income',
      value: toAmount(totals.income),
      trend: MTD_TRENDS.income,
    },
    {
      icon: FileText,
      label: 'Total allowable expenses',
      value: toAmount(totals.expenses),
      trend: MTD_TRENDS.expenses,
    },
    {
      icon: BarChart3,
      label: 'Property profit / (loss)',
      value: toAmount(totals.profit),
      trend: MTD_TRENDS.profit,
    },
    propertiesStat,
  ];
}

const MakingTaxDigital: React.FC = () => {
  const [tab, setTab] = useState<MtdTabValue>('overview');
  const [quarter, setQuarter] = useState('Q1');
  const [taxYear, setTaxYear] = useState('2026/27');

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
      onClick: () => setTab('overview'),
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
        <div className='border-border overflow-x-auto overflow-y-hidden border-b pb-1.25 scrollbar-none [&::-webkit-scrollbar]:hidden'>
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

        <ReportingPeriod
          quarter={quarter}
          taxYear={taxYear}
          onQuarterChange={setQuarter}
          onTaxYearChange={setTaxYear}
          status='DRAFT'
          lastUpdated={MTD_LAST_UPDATED}
        />

        <MtdStatCards stats={getStats(tab)} />

        <TabsContent value='overview'>
          <OverviewTab quickActions={transactionActions} onNavigate={setTab} />
        </TabsContent>
        <TabsContent value='income-expenses'>
          <IncomeExpensesTab onNavigate={setTab} onPending={onPending} />
        </TabsContent>
        <TabsContent value='properties'>
          <PropertiesTab onPending={onPending} />
        </TabsContent>
        <TabsContent value='finance-costs'>
          <FinanceCostsTab
            quickActions={financeCostActions}
            onPending={onPending}
          />
        </TabsContent>
        <TabsContent value='transactions'>
          <TransactionsTab
            quickActions={transactionActions}
            onPending={onPending}
          />
        </TabsContent>
        <TabsContent value='summary'>
          <SummaryTab quickActions={summaryActions} onPending={onPending} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MakingTaxDigital;
