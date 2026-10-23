'use client';

import { Download, FileSpreadsheet } from 'lucide-react';

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
import { cn } from '@/lib/utils';
import { getPortfolioTotals } from '@/data/client/Common/MakingTaxDigital/MakingTaxDigitalData';
import {
  HelpfulInfo,
  IconBadge,
  InfoNote,
  QuickAction,
  QuickActions,
  SectionCard,
  TableFrame,
  toAmount,
} from '../Shared/MtdShared';

interface SummaryTabProps {
  quickActions: QuickAction[];
  onPending: (label: string) => void;
}

const SummaryTab: React.FC<SummaryTabProps> = ({ quickActions, onPending }) => {
  const totals = getPortfolioTotals();
  // Other property income (parking, utilities recharged, etc.) is not yet
  // tracked separately from rent
  const otherIncome = 0;

  const rows = [
    {
      category: 'Total rental income',
      amount: toAmount(totals.income),
      notes: 'From all included properties',
    },
    {
      category: 'Total other property income',
      amount: toAmount(otherIncome),
      notes: 'Includes parking, utilities etc.',
    },
    {
      category: 'TOTAL PROPERTY INCOME',
      amount: toAmount(totals.income + otherIncome),
      notes: 'Sum of rental and other income',
      emphasis: true,
    },
    {
      category: 'Total allowable property expenses',
      amount: toAmount(totals.expenses),
      notes: 'Excludes finance costs',
    },
    {
      category:
        'NET PROPERTY PROFIT / (LOSS) before finance-cost tax treatment',
      amount: toAmount(totals.profit),
      notes: 'Income minus allowable expenses',
      emphasis: true,
    },
    {
      category: 'Total residential finance costs (separately recorded)',
      amount: toAmount(totals.financeCosts),
      notes: 'Mortgage and other finance costs',
    },
    {
      category: 'Number of properties included',
      amount: String(totals.propertyCount),
      notes: 'Properties in this report',
    },
  ];

  return (
    <div className='grid grid-cols-1 gap-4 xl:grid-cols-[1fr_320px]'>
      <div className='space-y-4'>
        <SectionCard
          icon={FileSpreadsheet}
          title='MTD Summary'
          description='A summary of your quarterly updates and annual totals for this period.'
        >
          <TableFrame>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Amount (£)</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => (
                  <TableRow
                    key={row.category}
                    className={cn(
                      row.emphasis &&
                        'bg-blue-50/60 font-semibold text-blue-700 dark:bg-blue-950/20 dark:text-blue-400',
                    )}
                  >
                    <TableCell className='whitespace-normal'>
                      {row.category}
                    </TableCell>
                    <TableCell className='tabular-nums'>{row.amount}</TableCell>
                    <TableCell className='text-muted-foreground'>
                      {row.notes}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableFrame>
          <InfoNote>
            Landkeeper will calculate these totals automatically from your
            property-level entries. Keep UK and overseas property business
            figures distinguishable where required.
          </InfoNote>
        </SectionCard>

        <Card className='border-border rounded-2xl shadow-md'>
          <CardContent className='flex flex-wrap items-center justify-between gap-3 px-5 py-3'>
            <div className='flex items-center gap-3'>
              <IconBadge icon={Download} className='size-9' />
              <div>
                <p className='text-foreground text-sm font-semibold'>
                  Download annual summary
                </p>
                <p className='text-muted-foreground text-xs'>
                  Get a full breakdown of your annual figures for your records.
                </p>
              </div>
            </div>
            <Button onClick={() => onPending('Download summary')}>
              <Download /> Download summary
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className='space-y-4'>
        <QuickActions actions={quickActions} />
        <HelpfulInfo
          items={[
            'Make sure all income and expenses are included for the correct tax quarter.',
            'Check that finance costs are recorded separately and not deducted from rental profit.',
            'Keep UK and overseas property business figures separate where required.',
            'Review your summary before submitting to HMRC.',
          ]}
        />
      </div>
    </div>
  );
};

export default SummaryTab;
