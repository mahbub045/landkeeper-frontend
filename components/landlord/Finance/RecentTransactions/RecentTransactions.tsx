'use client';

import {
  categoryStyles,
  transactions,
} from '@/data/landlord/finance/FinanceData';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export function formatGBP(amount: number): string {
  const abs = Math.abs(amount).toLocaleString('en-GB');

  return amount < 0 ? `-£${abs}` : `+£${abs}`;
}

const TABLE_HEADERS = ['DATE', 'DESCRIPTION', 'CATEGORY', 'AMOUNT'];

const RecentTransactions: React.FC = () => {
  return (
    <Card className='gap-0'>
      <CardHeader className='border-b pb-4'>
        <CardTitle className='text-base font-semibold'>
          Recent Transactions
        </CardTitle>
      </CardHeader>

      <CardContent className='p-2'>
        <div className='max-h-85 overflow-y-auto'>
          <Table className='p-2'>
            <TableHeader className='bg-card sticky top-0'>
              <TableRow className='text-xs'>
                <TableHead className='w-22.5 font-semibold'>DATE</TableHead>
                <TableHead className='font-semibold'>DESCRIPTION</TableHead>
                <TableHead className='w-32.5 text-center font-semibold'>
                  CATEGORY
                </TableHead>
                <TableHead className='w-25 text-center font-semibold'>AMOUNT</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {transactions.map((tx) => (
                <TableRow key={tx.id} className='hover:bg-accent/40'>
                  <TableCell className='text-muted-foreground text-xs tabular-nums'>
                    {tx.date}
                  </TableCell>

                  <TableCell className='text-foreground text-xs'>
                    {tx.description}
                  </TableCell>

                  <TableCell className='text-center'>
                    <Badge
                      variant='outline'
                      className={categoryStyles[tx.category]}
                    >
                      {tx.category}
                    </Badge>
                  </TableCell>

                  <TableCell
                    className={`text-center text-xs font-bold tabular-nums ${
                      tx.amount < 0 ? 'text-danger' : 'text-success'
                    }`}
                  >
                    {formatGBP(tx.amount)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentTransactions;
