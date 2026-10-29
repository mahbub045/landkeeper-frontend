'use client';

import {
  BarChart3,
  FileSpreadsheet,
  FileText,
  Home,
  Landmark,
  LucideIcon,
  Receipt,
  Wallet,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  filterPeriodByProperties,
  getMtdPeriodData,
  getPortfolioTotals,
  getPropertyTotals,
  MTD_PROPERTIES,
  MTD_TAX_YEARS,
} from '@/data/client/Common/MakingTaxDigital/MakingTaxDigitalData';
import {
  MtdPeriodData,
  MtdTabValue,
} from '@/types/client/Common/MakingTaxDigital/MakingTaxDigitalTypes';
import MtdPropertiesTable from './Shared/MtdPropertiesTable';
import { IconBadge, MtdStat, MtdStatCards, toAmount } from './Shared/MtdShared';
import ReportingPeriod from './Shared/ReportingPeriod';
import FinanceCostsTab from './Tabs/FinanceCostsTab';
import IncomeExpensesTab from './Tabs/IncomeExpensesTab';
import SummaryTab from './Tabs/SummaryTab';

const TABS: { value: MtdTabValue; label: string; icon: LucideIcon }[] = [
  { value: 'income-expenses', label: 'Income & Expenses', icon: Receipt },
  { value: 'finance-costs', label: 'Finance Costs', icon: Landmark },
  { value: 'summary', label: 'Summary', icon: FileSpreadsheet },
];

function getStats(
  tab: MtdTabValue,
  data: MtdPeriodData,
  propertyCount: number,
): MtdStat[] {
  const totals = getPortfolioTotals(data, propertyCount);
  const propertiesStat: MtdStat = {
    icon: Home,
    label: 'Properties included',
    value: `${totals.propertyCount} of ${MTD_PROPERTIES.length}`,
    tone: 'neutral',
  };

  if (tab === 'finance-costs') {
    return [
      {
        icon: Wallet,
        label: 'Total finance costs',
        value: toAmount(totals.financeCosts),
      },
      {
        icon: FileText,
        label: 'Total mortgage interest',
        value: toAmount(totals.mortgageInterest),
      },
      {
        icon: Landmark,
        label: 'Total other finance costs',
        value: toAmount(totals.otherFinanceCosts),
      },
      propertiesStat,
    ];
  }

  return [
    {
      icon: Wallet,
      label: 'Total rental income',
      value: toAmount(totals.income),
    },
    {
      icon: FileText,
      label: 'Total allowable expenses',
      value: toAmount(totals.expenses),
    },
    {
      icon: BarChart3,
      label: 'Property profit / (loss)',
      value: toAmount(totals.profit),
    },
    propertiesStat,
  ];
}

const MakingTaxDigital: React.FC = () => {
  const [tab, setTab] = useState<MtdTabValue>('income-expenses');
  const [quarter, setQuarter] = useState('Q1');
  const [taxYear, setTaxYear] = useState(MTD_TAX_YEARS[0].value);
  const [selected, setSelected] = useState<string[]>(() =>
    MTD_PROPERTIES.map((p) => p.alias),
  );
  const periodData = useMemo(
    () => getMtdPeriodData(quarter, taxYear),
    [quarter, taxYear],
  );
  const data = useMemo(
    () => filterPeriodByProperties(periodData, selected),
    [periodData, selected],
  );
  const selectedProperties = MTD_PROPERTIES.filter((p) =>
    selected.includes(p.alias),
  );

  // Actions that need the MTD API; replace with real handlers once it exists
  const onPending = (label: string) =>
    toast.info(`${label} will be available soon.`);

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

      <ReportingPeriod
        quarter={quarter}
        taxYear={taxYear}
        onQuarterChange={setQuarter}
        onTaxYearChange={setTaxYear}
      />

      <MtdPropertiesTable
        rows={getPropertyTotals(periodData)}
        selected={selected}
        onSelectedChange={setSelected}
      />

      {selectedProperties.length === 0 ? (
        <Card className='border-border rounded-2xl border-dashed shadow-none'>
          <CardContent className='flex flex-col items-center gap-3 py-10 text-center'>
            <IconBadge icon={Home} />
            <div>
              <p className='text-foreground text-sm font-semibold'>
                No properties selected
              </p>
              <p className='text-muted-foreground text-xs'>
                Tick at least one property above to see its income, expenses and
                summary.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Tabs
          value={tab}
          onValueChange={(value) => setTab(value as MtdTabValue)}
          className='gap-6'
        >
          <MtdStatCards
            stats={getStats(tab, data, selectedProperties.length)}
          />

          <div className='border-border scrollbar-none overflow-x-auto overflow-y-hidden border-b pb-1.25 [&::-webkit-scrollbar]:hidden'>
            <TabsList variant='line' className='h-10! gap-2'>
              {TABS.map((t) => (
                <TabsTrigger
                  key={t.value}
                  value={t.value}
                  className='cursor-pointer gap-2 px-3 after:bg-blue-600 data-active:text-blue-700 dark:data-active:text-blue-400'
                >
                  <t.icon className='size-4' />
                  {t.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent value='income-expenses'>
            <IncomeExpensesTab
              data={data}
              properties={selectedProperties}
              onPending={onPending}
            />
          </TabsContent>
          <TabsContent value='finance-costs'>
            <FinanceCostsTab
              data={data}
              properties={selectedProperties}
              onPending={onPending}
            />
          </TabsContent>
          <TabsContent value='summary'>
            <SummaryTab
              data={data}
              properties={selectedProperties}
              onPending={onPending}
            />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default MakingTaxDigital;
