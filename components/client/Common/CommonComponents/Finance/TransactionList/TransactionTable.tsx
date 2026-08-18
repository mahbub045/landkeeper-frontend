'use client';

import { Eye, FileText, ImageIcon, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { FinanceTransaction } from '@/types/client/Common/Finance/FinanceTypes';
import formatChoiceFieldValue, { formatDate } from '@/utils/formatters';
import DeleteTransactionDialog from '../Dialogs/DeleteTransactionDialog';
import UpdateTransactionDialog from '../Dialogs/UpdateTransactionDialog';

function formatAmount(
  amount: string,
  type: FinanceTransaction['type'],
): string {
  const value = Number(amount).toLocaleString('en-GB', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return type === 'EXPENSE' ? `-£${value}` : `+£${value}`;
}

function getFileIcon(filename: string) {
  const ext = filename.split('.').pop()?.toLowerCase();
  if (['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext ?? '')) {
    return <ImageIcon className='h-4 w-4 shrink-0' />;
  }
  return <FileText className='h-4 w-4 shrink-0' />;
}

interface TransactionTableProps {
  transactions: FinanceTransaction[];
  isLoading?: boolean;
}

const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  isLoading,
}) => {
  const [editingTx, setEditingTx] = useState<FinanceTransaction | null>(null);
  const [deletingTx, setDeletingTx] = useState<FinanceTransaction | null>(null);

  if (isLoading) {
    return (
      <div className='space-y-3 px-4 py-3'>
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className='h-12 w-full' />
        ))}
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <p className='text-muted-foreground py-10 text-center text-sm'>
        No transactions found.
      </p>
    );
  }

  return (
    <>
      <Table>
        <TableHeader className='bg-card'>
          <TableRow>
            <TableHead className='pl-4'>Date</TableHead>
            <TableHead>Property</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className='text-right'>Amount</TableHead>
            <TableHead className='text-center'>File</TableHead>
            <TableHead className='pr-4 text-right'>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {transactions.map((tx) => {
            const fileUrl = tx.receipt_files[0]?.file;

            return (
              <TableRow key={tx.alias} className='hover:bg-accent/40'>
                <TableCell className='pl-4 text-xs tabular-nums'>
                  {formatDate(tx.date)}
                </TableCell>

                <TableCell className='text-foreground text-xs'>
                  {tx.property.property_name}
                </TableCell>

                <TableCell>
                  <Badge
                    variant='outline'
                    className={
                      tx.type === 'EXPENSE'
                        ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                        : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
                    }
                  >
                    {tx.type === 'EXPENSE' ? 'Expense' : 'Income'}
                  </Badge>
                </TableCell>

                <TableCell>
                  <Badge variant='secondary' className='font-normal'>
                    {formatChoiceFieldValue(tx.category)}
                  </Badge>
                </TableCell>

                <TableCell className='text-muted-foreground max-w-50 truncate text-xs'>
                  {tx.description || '—'}
                </TableCell>

                <TableCell
                  className={`text-right text-xs font-bold tabular-nums ${
                    tx.type === 'EXPENSE' ? 'text-danger' : 'text-success'
                  }`}
                >
                  {formatAmount(tx.amount, tx.type)}
                </TableCell>

                <TableCell className='text-center'>
                  {tx.receipt_files.length === 0 ? (
                    <Button variant='outline' size='sm' disabled>
                      <Eye />
                      View
                    </Button>
                  ) : tx.receipt_files.length === 1 ? (
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() =>
                        window.open(tx.receipt_files[0].file, '_blank')
                      }
                    >
                      <Eye />
                      View
                    </Button>
                  ) : (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant='outline' size='sm'>
                          <Eye />
                          View ({tx.receipt_files.length})
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className='w-64 p-2' align='center'>
                        <ul className='space-y-1'>
                          {tx.receipt_files.map((r) => {
                            const filename =
                              r.file.split('/').pop() || `file-${r.id}`;
                            return (
                              <li key={r.id}>
                                <a
                                  href={r.file}
                                  target='_blank'
                                  rel='noopener noreferrer'
                                  className='hover:bg-muted flex items-center gap-2 rounded-md px-2 py-1.5 text-sm'
                                >
                                  {getFileIcon(filename)}
                                  <span className='truncate'>{filename}</span>
                                </a>
                              </li>
                            );
                          })}
                        </ul>
                      </PopoverContent>
                    </Popover>
                  )}
                </TableCell>

                <TableCell className='pr-4'>
                  <div className='flex items-center justify-end gap-2'>
                    <Button
                      variant='outline'
                      size='icon'
                      aria-label='Edit'
                      title='Edit Transaction'
                      onClick={() => setEditingTx(tx)}
                    >
                      <Pencil />
                    </Button>

                    <Button
                      variant='destructive'
                      size='icon'
                      aria-label='Delete'
                      title='Delete Transaction'
                      onClick={() => setDeletingTx(tx)}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <UpdateTransactionDialog
        key={editingTx?.alias}
        transaction={editingTx}
        open={!!editingTx}
        onClose={() => setEditingTx(null)}
        onSuccess={() => setEditingTx(null)}
      />

      <DeleteTransactionDialog
        open={!!deletingTx}
        onClose={() => setDeletingTx(null)}
        onSuccess={() => setDeletingTx(null)}
        transactionAlias={deletingTx?.alias ?? ''}
        transactionDescription={
          deletingTx?.description ||
          formatChoiceFieldValue(deletingTx?.category ?? '')
        }
      />
    </>
  );
};

export default TransactionTable;
