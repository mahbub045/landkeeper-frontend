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
  getMtdPeriodData,
  getPropertyTotals,
  MTD_PROPERTIES,
  MTD_TAX_YEARS,
} from '@/data/client/Common/MakingTaxDigital/MakingTaxDigitalData';
import {
  MakingTaxDigitalApi,
  useGetMTDReportsQuery,
  useSelectMTDPropertiesMutation,
} from '@/store/api/endpoints/client/Common/MakingTaxDigital/MakingTaxDigitalApi';
import { useAppDispatch } from '@/store/hooks';
import {
  MtdReport,
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

// Same report-level cards on every tab
function getStats(report: MtdReport | undefined): MtdStat[] {
  return [
    {
      icon: Wallet,
      label: 'Total rental income',
      value: toAmount(report?.total_income ?? 0),
    },
    {
      icon: FileText,
      label: 'Total allowable expenses',
      value: toAmount(report?.total_allowable_expenses ?? 0),
    },
    {
      icon: BarChart3,
      label: 'Property profit / (loss)',
      value: toAmount(report?.property_profit ?? 0),
    },
    {
      icon: Home,
      label: 'Total mortgage interest',
      value: toAmount(report?.total_mortgage_interest ?? 0),
    },
  ];
}

const MakingTaxDigital: React.FC = () => {
  const [tab, setTab] = useState<MtdTabValue>('income-expenses');
  const [quarter, setQuarter] = useState('Q1');
  const [taxYear, setTaxYear] = useState(MTD_TAX_YEARS[0].value);
  const dispatch = useAppDispatch();

  const reportParams = { tax_year: taxYear, quarter };
  const { data: reports } = useGetMTDReportsQuery(reportParams);
  const report: MtdReport | undefined = reports?.[0];
  const selected = report?.properties ?? [];
  const [selectMTDProperties] = useSelectMTDPropertiesMutation();

  // Update the cached report first so the tick shows straight away,
  // and roll it back if the save fails
  async function handleSelectedChange(aliases: string[]) {
    if (!report) return;
    const patch = dispatch(
      MakingTaxDigitalApi.util.updateQueryData(
        'getMTDReports',
        reportParams,
        (draft: MtdReport[]) => {
          if (draft[0]) draft[0].properties = aliases;
        },
      ),
    );
    try {
      await selectMTDProperties({
        reportAlias: report.alias,
        payload: { properties: aliases },
      }).unwrap();
    } catch {
      patch.undo();
      toast.error('Failed to update the properties in this report.');
    }
  }

  // Tabs still run on placeholder data until their MTD endpoints are wired
  const periodData = useMemo(
    () => getMtdPeriodData(quarter, taxYear),
    [quarter, taxYear],
  );
  const data = periodData;
  const selectedProperties = MTD_PROPERTIES;

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
        includedCount={report?.number_of_properties_included ?? 0}
        onSelectedChange={handleSelectedChange}
      />

      {selected.length === 0 ? (
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
          <MtdStatCards stats={getStats(report)} />

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
            <IncomeExpensesTab report={report} onPending={onPending} />
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
              report={report}
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
