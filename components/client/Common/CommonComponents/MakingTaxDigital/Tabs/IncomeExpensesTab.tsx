'use client';

import {
  Building,
  Calculator,
  ChevronRight,
  Home,
  Info,
  Plus,
  Receipt,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  MtdPeriodData,
  MtdTabValue,
} from '@/types/client/Common/MakingTaxDigital/MakingTaxDigitalTypes';
import { formatDate } from '@/utils/formatters';
import {
  getPortfolioTotals,
  getPropertyName,
  getPropertyTotals,
} from '@/data/client/Common/MakingTaxDigital/MakingTaxDigitalData';
import {
  HelpfulInfo,
  RowActions,
  SectionCard,
  TableFrame,
  toAmount,
} from '../Shared/MtdShared';

interface IncomeExpensesTabProps {
  data: MtdPeriodData;
  onNavigate: (tab: MtdTabValue) => void;
  onPending: (label: string) => void;
}

function TotalRow({ label, value }: { label: string; value: number }) {
  return (
    <div className='flex items-center justify-between rounded-xl border border-blue-100 bg-blue-50/60 px-4 py-3 dark:border-blue-900/40 dark:bg-blue-950/20'>
      <div className='flex items-center gap-3'>
        <Calculator className='size-5 text-blue-600 dark:text-blue-400' />
        <span className='text-foreground text-sm font-medium'>{label}</span>
      </div>
      <span className='text-lg font-bold text-emerald-600 tabular-nums dark:text-emerald-400'>
        {toAmount(value)}
      </span>
    </div>
  );
}

const IncomeExpensesTab: React.FC<IncomeExpensesTabProps> = ({
  data,
  onNavigate,
  onPending,
}) => {
  const totals = getPortfolioTotals(data);
  const breakdown = getPropertyTotals(data);

  return (
    <div className='space-y-4'>
      <div className='grid grid-cols-1 gap-4 xl:grid-cols-2'>
        <SectionCard
          icon={Building}
          title='Rental income'
          description='Enter your rental and other property income for this quarter.'
          action={
            <Button onClick={() => onPending('Add income')}>
              <Plus /> Add income
            </Button>
          }
        >
          <TableFrame>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Property</TableHead>
                  <TableHead>Income type</TableHead>
                  <TableHead>Amount (£)</TableHead>
                  <TableHead>Date received</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.income.map((entry) => (
                  <TableRow key={entry.alias}>
                    <TableCell className='text-foreground font-medium'>
                      {getPropertyName(entry.property_alias)}
                    </TableCell>
                    <TableCell>{entry.income_type}</TableCell>
                    <TableCell className='tabular-nums'>
                      {toAmount(entry.amount)}
                    </TableCell>
                    <TableCell>{formatDate(entry.date)}</TableCell>
                    <TableCell>
                      <RowActions
                        onEdit={() => onPending('Edit income')}
                        onDelete={() => onPending('Delete income')}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableFrame>
          <TotalRow
            label='Total rental income (all properties)'
            value={totals.income}
          />
        </SectionCard>

        <SectionCard
          icon={Receipt}
          title='Allowable expenses'
          description='Enter your property expenses for this quarter.'
          action={
            <Button onClick={() => onPending('Add expense')}>
              <Plus /> Add expense
            </Button>
          }
        >
          <TableFrame>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Property</TableHead>
                  <TableHead>Expense category</TableHead>
                  <TableHead>Amount (£)</TableHead>
                  <TableHead>Date paid</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.expenses.map((entry) => (
                  <TableRow key={entry.alias}>
                    <TableCell className='text-foreground font-medium'>
                      {getPropertyName(entry.property_alias)}
                    </TableCell>
                    <TableCell>{entry.category}</TableCell>
                    <TableCell className='tabular-nums'>
                      {toAmount(entry.amount)}
                    </TableCell>
                    <TableCell>{formatDate(entry.date)}</TableCell>
                    <TableCell>
                      <RowActions
                        onEdit={() => onPending('Edit expense')}
                        onDelete={() => onPending('Delete expense')}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableFrame>
          <TotalRow
            label='Total allowable expenses (all properties)'
            value={totals.expenses}
          />
        </SectionCard>
      </div>

      <div className='grid grid-cols-1 gap-4 xl:grid-cols-[1fr_320px]'>
        <SectionCard
          icon={Home}
          title='Property breakdown'
          description='See how each property is performing this quarter.'
          action={
            <Button
              variant='link'
              size='sm'
              onClick={() => onNavigate('properties')}
            >
              View all properties
            </Button>
          }
        >
          <TableFrame>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Property</TableHead>
                  <TableHead>Rental income (£)</TableHead>
                  <TableHead>Allowable expenses (£)</TableHead>
                  <TableHead>Finance costs (£)</TableHead>
                  <TableHead>Property profit / (loss) (£)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {breakdown.map((row) => (
                  <TableRow key={row.property.alias}>
                    <TableCell className='font-medium text-blue-700 dark:text-blue-400'>
                      {row.property.name}
                    </TableCell>
                    <TableCell className='tabular-nums'>
                      {toAmount(row.income)}
                    </TableCell>
                    <TableCell className='tabular-nums'>
                      {toAmount(row.expenses)}
                    </TableCell>
                    <TableCell className='tabular-nums'>
                      {toAmount(row.financeCosts)}
                    </TableCell>
                    <TableCell className='font-semibold text-emerald-600 tabular-nums dark:text-emerald-400'>
                      {toAmount(row.profit)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter className='bg-blue-50/60 font-semibold dark:bg-blue-950/20'>
                <TableRow>
                  <TableCell>Total (all properties)</TableCell>
                  <TableCell className='tabular-nums'>
                    {toAmount(totals.income)}
                  </TableCell>
                  <TableCell className='tabular-nums'>
                    {toAmount(totals.expenses)}
                  </TableCell>
                  <TableCell className='tabular-nums'>
                    {toAmount(totals.financeCosts)}
                  </TableCell>
                  <TableCell className='text-emerald-600 tabular-nums dark:text-emerald-400'>
                    {toAmount(totals.profit)}
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </TableFrame>
        </SectionCard>

        <HelpfulInfo
          items={[
            'Include all UK residential property income and allowable expenses in your quarterly update.',
            'Residential finance costs must be recorded separately and are not deducted from rental profit.',
            'You can edit individual transactions at any time before submitting your update.',
            <>
              Make sure you have{' '}
              <strong className='text-foreground'>
                supporting evidence for all
              </strong>{' '}
              transactions (receipts, invoices, bank statements).
            </>,
          ]}
          footer={
            <a
              href='https://www.gov.uk/guidance/use-making-tax-digital-for-income-tax'
              target='_blank'
              rel='noopener noreferrer'
              className='border-border bg-card hover:bg-accent/50 flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium text-blue-700 transition-colors dark:text-blue-400'
            >
              <Info className='size-4' />
              <span className='flex-1'>
                HMRC guidance on MTD for Income Tax
              </span>
              <ChevronRight className='size-4' />
            </a>
          }
        />
      </div>
    </div>
  );
};

export default IncomeExpensesTab;
