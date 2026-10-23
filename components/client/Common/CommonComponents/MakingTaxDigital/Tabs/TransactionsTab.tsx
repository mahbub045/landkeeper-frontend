'use client';

import { ClipboardList, Download, Plus } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { formatDate } from '@/utils/formatters';
import { getPropertyName, MTD_TRANSACTIONS } from '../mtdData';
import {
  HelpfulInfo,
  IconBadge,
  QuickAction,
  QuickActions,
  RowActions,
  SectionCard,
  TableFrame,
  toAmount,
} from '../Shared/MtdShared';

const PAGE_SIZE = 8;

type TypeFilter = 'all' | 'INCOME' | 'EXPENSE';

interface TransactionsTabProps {
  quickActions: QuickAction[];
  onPending: (label: string) => void;
}

const TransactionsTab: React.FC<TransactionsTabProps> = ({
  quickActions,
  onPending,
}) => {
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [page, setPage] = useState(1);

  const filtered = MTD_TRANSACTIONS.filter(
    (tx) => typeFilter === 'all' || tx.type === typeFilter,
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const firstShown = filtered.length ? (page - 1) * PAGE_SIZE + 1 : 0;
  const lastShown = Math.min(page * PAGE_SIZE, filtered.length);

  function handleFilterChange(value: string) {
    setTypeFilter(value as TypeFilter);
    setPage(1);
  }

  return (
    <div className='grid grid-cols-1 gap-4 xl:grid-cols-[1fr_320px]'>
      <div className='space-y-4'>
        <SectionCard
          icon={ClipboardList}
          title='Transaction log'
          description='View and manage all income and expense transactions for this quarter.'
          action={
            <>
              <Button onClick={() => onPending('Add transaction')}>
                <Plus /> Add transaction
              </Button>
              <Select value={typeFilter} onValueChange={handleFilterChange}>
                <SelectTrigger className='w-40'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All transactions</SelectItem>
                  <SelectItem value='INCOME'>Income</SelectItem>
                  <SelectItem value='EXPENSE'>Expenses</SelectItem>
                </SelectContent>
              </Select>
            </>
          }
        >
          <TableFrame>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Property</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Description / Payee</TableHead>
                  <TableHead>Amount (£)</TableHead>
                  <TableHead>Receipt / Ref.</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pageRows.map((tx) => {
                  const isExpense = tx.type === 'EXPENSE';
                  return (
                    <TableRow key={tx.alias}>
                      <TableCell>{formatDate(tx.date)}</TableCell>
                      <TableCell className='text-blue-700 dark:text-blue-400'>
                        {getPropertyName(tx.property_alias)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant='outline'
                          className={
                            isExpense
                              ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                              : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
                          }
                        >
                          {isExpense ? 'Expense' : 'Income'}
                        </Badge>
                      </TableCell>
                      <TableCell>{tx.category}</TableCell>
                      <TableCell className='text-blue-700 dark:text-blue-400'>
                        {tx.description}
                      </TableCell>
                      <TableCell
                        className={cn(
                          'font-semibold tabular-nums',
                          isExpense
                            ? 'text-red-600 dark:text-red-400'
                            : 'text-emerald-600 dark:text-emerald-400',
                        )}
                      >
                        {isExpense ? '-' : ''}
                        {toAmount(tx.amount)}
                      </TableCell>
                      <TableCell>{tx.reference}</TableCell>
                      <TableCell>
                        <RowActions
                          onEdit={() => onPending('Edit transaction')}
                          onDelete={() => onPending('Delete transaction')}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableFrame>

          <div className='flex flex-wrap items-center justify-between gap-3'>
            <p className='text-muted-foreground text-xs'>
              Showing {firstShown}–{lastShown} of {filtered.length} transactions
            </p>
            {totalPages > 1 && (
              <Pagination className='mx-0 w-auto'>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      className={cn(
                        page === 1 && 'pointer-events-none opacity-50',
                      )}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (n) => (
                      <PaginationItem key={n}>
                        <PaginationLink
                          isActive={n === page}
                          onClick={() => setPage(n)}
                        >
                          {n}
                        </PaginationLink>
                      </PaginationItem>
                    ),
                  )}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                      className={cn(
                        page === totalPages && 'pointer-events-none opacity-50',
                      )}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        </SectionCard>

        <Card className='border-border rounded-2xl shadow-md'>
          <CardContent className='flex flex-wrap items-center justify-between gap-3 px-5 py-3'>
            <div className='flex items-center gap-3'>
              <IconBadge icon={Download} className='size-9' />
              <div>
                <p className='text-foreground text-sm font-semibold'>
                  Download transaction report
                </p>
                <p className='text-muted-foreground text-xs'>
                  Get a full breakdown of your transactions for this period.
                </p>
              </div>
            </div>
            <Button onClick={() => onPending('Download transaction report')}>
              Download report
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className='space-y-4'>
        <QuickActions actions={quickActions} />
        <HelpfulInfo
          items={[
            'Record all income and expenses accurately and keep supporting evidence (where available).',
            'Keep UK and overseas property transactions separate where required.',
            'Ensure transactions are categorised correctly for HMRC reporting.',
            'You can edit or delete transactions before submitting your updates.',
          ]}
        />
      </div>
    </div>
  );
};

export default TransactionsTab;
