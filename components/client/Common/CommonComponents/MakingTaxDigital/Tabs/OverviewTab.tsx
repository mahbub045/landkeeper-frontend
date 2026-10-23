'use client';

import { Building2, Home, Info, PieChart } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { MtdTabValue } from '@/types/client/Common/MakingTaxDigital/MakingTaxDigitalTypes';
import { getPortfolioTotals, getPropertyTotals, MTD_TRENDS } from '../mtdData';
import {
  QuickAction,
  QuickActions,
  SectionCard,
  TableFrame,
  toAmount,
  TotalsBar,
} from '../Shared/MtdShared';

interface OverviewTabProps {
  quickActions: QuickAction[];
  onNavigate: (tab: MtdTabValue) => void;
}

const OverviewTab: React.FC<OverviewTabProps> = ({
  quickActions,
  onNavigate,
}) => {
  const totals = getPortfolioTotals();
  const rows = getPropertyTotals();

  const miniStats = [
    {
      label: 'Total rental income',
      value: toAmount(totals.income),
      trend: MTD_TRENDS.income,
    },
    {
      label: 'Total allowable expenses',
      value: toAmount(totals.expenses),
      trend: MTD_TRENDS.expenses,
    },
    {
      label: 'Property profit / (loss)',
      value: toAmount(totals.profit),
      trend: MTD_TRENDS.profit,
    },
    {
      label: 'Properties included',
      value: String(totals.propertyCount),
      caption: 'All properties selected',
    },
  ];

  return (
    <div className='grid grid-cols-1 gap-4 xl:grid-cols-[1fr_320px]'>
      <SectionCard
        icon={Home}
        title='Portfolio overview'
        description='Total figures for all properties in your portfolio.'
      >
        <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4'>
          {miniStats.map((stat) => (
            <div
              key={stat.label}
              className='rounded-xl border border-blue-100 bg-blue-50/60 px-4 py-3 dark:border-blue-900/40 dark:bg-blue-950/20'
            >
              <p className='text-foreground text-xs font-medium'>
                {stat.label}
              </p>
              <p className='text-foreground mt-1 text-lg font-bold tabular-nums'>
                {stat.value}
              </p>
              {stat.trend != null ? (
                <p className='mt-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400'>
                  ▲ {stat.trend}%
                </p>
              ) : (
                <p className='text-muted-foreground mt-1 text-xs'>
                  {stat.caption}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className='border-border space-y-3 border-t pt-4'>
          <div className='flex flex-wrap items-start justify-between gap-2'>
            <div className='flex items-start gap-3'>
              <Building2 className='mt-0.5 size-5 text-blue-600 dark:text-blue-400' />
              <div>
                <h3 className='text-foreground text-sm font-semibold'>
                  Properties in this report
                </h3>
                <p className='text-muted-foreground text-xs'>
                  These properties are included in your MTD update for this
                  quarter.
                </p>
              </div>
            </div>
            <Button
              variant='link'
              size='sm'
              onClick={() => onNavigate('properties')}
            >
              Manage properties
            </Button>
          </div>

          <TableFrame>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Property</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Rental income</TableHead>
                  <TableHead>Allowable expenses</TableHead>
                  <TableHead>Profit / (loss)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.property.alias}>
                    <TableCell className='text-foreground font-medium'>
                      {row.property.name}
                    </TableCell>
                    <TableCell className='text-muted-foreground'>
                      {row.property.address}
                    </TableCell>
                    <TableCell className='font-medium tabular-nums'>
                      {toAmount(row.income)}
                    </TableCell>
                    <TableCell className='tabular-nums'>
                      {toAmount(row.expenses)}
                    </TableCell>
                    <TableCell className='font-semibold text-emerald-600 tabular-nums dark:text-emerald-400'>
                      {toAmount(row.profit)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableFrame>

          <TotalsBar
            icon={PieChart}
            title='Portfolio totals'
            description='Figures are automatically calculated from all properties included in this report.'
            items={[
              { label: 'Total income', value: toAmount(totals.income) },
              { label: 'Total expenses', value: toAmount(totals.expenses) },
              {
                label: 'Total profit / (loss)',
                value: toAmount(totals.profit),
                highlight: true,
              },
            ]}
          />
        </div>
      </SectionCard>

      <div className='space-y-4'>
        <QuickActions actions={quickActions} />
        <Card className='rounded-2xl border-blue-100 bg-blue-50/40 shadow-md dark:border-blue-900/40 dark:bg-blue-950/20'>
          <CardContent className='flex gap-3 px-5 py-4'>
            <Info className='size-5 shrink-0 text-blue-600 dark:text-blue-400' />
            <div>
              <h2 className='text-foreground text-sm font-semibold'>
                Important
              </h2>
              <p className='text-muted-foreground mt-1 text-xs leading-relaxed'>
                Ensure all income, expenses and finance costs are recorded
                accurately. Tax treatment depends on your individual
                circumstances and the applicable rules.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OverviewTab;
