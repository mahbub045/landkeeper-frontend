'use client';

import {
  Building,
  Calculator,
  ChevronRight,
  Info,
  Receipt,
} from 'lucide-react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  getPortfolioTotals,
  getPropertyName,
} from '@/data/client/Common/MakingTaxDigital/MakingTaxDigitalData';
import { MtdPeriodData } from '@/types/client/Common/MakingTaxDigital/MakingTaxDigitalTypes';
import { formatDate } from '@/utils/formatters';
import {
  HelpfulInfo,
  RowActions,
  SectionCard,
  TableFrame,
  toAmount,
} from '../Shared/MtdShared';

interface IncomeExpensesTabProps {
  data: MtdPeriodData;
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
  onPending,
}) => {
  const totals = getPortfolioTotals(data);

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
                      <RowActions onDelete={() => onPending('Delete income')} />
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
