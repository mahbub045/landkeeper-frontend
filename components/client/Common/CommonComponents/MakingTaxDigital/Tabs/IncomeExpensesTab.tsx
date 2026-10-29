'use client';

import {
  Building,
  Calculator,
  ChevronRight,
  Info,
  Receipt,
  Trash2,
} from 'lucide-react';

import Loading from '@/components/common/CustomLoader/Loading';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getReportScopeLabel } from '@/data/client/Common/MakingTaxDigital/MakingTaxDigitalData';
import { useGetMTDIncomeExpensesQuery } from '@/store/api/endpoints/client/Common/MakingTaxDigital/MakingTaxDigitalApi';
import {
  MtdIncomeExpenses,
  MtdReportTabProps,
} from '@/types/client/Common/MakingTaxDigital/MakingTaxDigitalTypes';
import formatChoiceFieldValue, { formatDate } from '@/utils/formatters';
import {
  HelpfulInfo,
  SectionCard,
  TableFrame,
  toAmount,
} from '../Shared/MtdShared';

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

const IncomeExpensesTab: React.FC<MtdReportTabProps> = ({
  report,
  onPending,
}) => {
  const { data, isFetching } = useGetMTDIncomeExpensesQuery(
    { reportAlias: report?.alias },
    { skip: !report },
  );
  const { income, expenses }: MtdIncomeExpenses = data ?? {
    income: [],
    expenses: [],
  };

  const scope = getReportScopeLabel(report);
  // One property needs no per-row property column
  const showProperty = (report?.number_of_properties_included ?? 0) > 1;
  const columnCount = showProperty ? 5 : 4;

  // Loading / empty placeholder row, or null when there are entries to show
  const placeholderRow = (count: number, emptyText: string) =>
    isFetching ? (
      <TableRow>
        <TableCell colSpan={columnCount}>
          <div className='flex justify-center py-6'>
            <Loading />
          </div>
        </TableCell>
      </TableRow>
    ) : count === 0 ? (
      <TableRow>
        <TableCell
          colSpan={columnCount}
          className='text-muted-foreground py-6 text-center'
        >
          {emptyText}
        </TableCell>
      </TableRow>
    ) : null;

  return (
    <div className='space-y-4'>
      <div className='grid grid-cols-1 gap-4 xl:grid-cols-2'>
        <SectionCard
          icon={Building}
          title='Rental income'
          description='Enter your rental and other property income for this quarter.'
        >
          <TableFrame>
            <Table>
              <TableHeader>
                <TableRow>
                  {showProperty && <TableHead>Property</TableHead>}
                  <TableHead>Income type</TableHead>
                  <TableHead>Amount (£)</TableHead>
                  <TableHead>Date received</TableHead>
                  <TableHead className='text-center'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {placeholderRow(
                  income.length,
                  'No income recorded for this quarter.',
                ) ??
                  income.map((entry) => (
                    <TableRow key={entry.alias}>
                      {showProperty && (
                        <TableCell className='text-foreground font-medium'>
                          {entry.property_name}
                        </TableCell>
                      )}
                      <TableCell>
                        {formatChoiceFieldValue(entry.category)}
                      </TableCell>
                      <TableCell className='tabular-nums'>
                        {toAmount(Number(entry.amount))}
                      </TableCell>
                      <TableCell>{formatDate(entry.date)}</TableCell>
                      <TableCell className='text-center'>
                        <Button
                          variant='destructive'
                          size='icon-sm'
                          aria-label='Delete'
                          onClick={() => onPending('Delete income')}
                        >
                          <Trash2 />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableFrame>
          <TotalRow
            label={`Total rental income (${scope})`}
            value={report?.total_income ?? 0}
          />
        </SectionCard>

        <SectionCard
          icon={Receipt}
          title='Allowable expenses'
          description='Enter your property expenses for this quarter.'
        >
          <TableFrame>
            <Table>
              <TableHeader>
                <TableRow>
                  {showProperty && <TableHead>Property</TableHead>}
                  <TableHead>Expense category</TableHead>
                  <TableHead>Amount (£)</TableHead>
                  <TableHead>Date paid</TableHead>
                  <TableHead className='text-center'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {placeholderRow(
                  expenses.length,
                  'No expenses recorded for this quarter.',
                ) ??
                  expenses.map((entry) => (
                    <TableRow key={entry.alias}>
                      {showProperty && (
                        <TableCell className='text-foreground font-medium'>
                          {entry.property_name}
                        </TableCell>
                      )}
                      <TableCell>
                        {formatChoiceFieldValue(entry.category)}
                      </TableCell>
                      <TableCell className='tabular-nums'>
                        {toAmount(Number(entry.amount))}
                      </TableCell>
                      <TableCell>{formatDate(entry.date)}</TableCell>
                      <TableCell className='text-center'>
                        <Button
                          variant='destructive'
                          size='icon-sm'
                          aria-label='Delete'
                          onClick={() => onPending('Delete expense')}
                        >
                          <Trash2 />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableFrame>
          <TotalRow
            label={`Total allowable expenses (${scope})`}
            value={report?.total_allowable_expenses ?? 0}
          />
        </SectionCard>
      </div>

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
            <span className='flex-1'>HMRC guidance on MTD for Income Tax</span>
            <ChevronRight className='size-4' />
          </a>
        }
      />
    </div>
  );
};

export default IncomeExpensesTab;
