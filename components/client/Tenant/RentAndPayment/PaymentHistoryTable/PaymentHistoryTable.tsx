'use client';

import { Receipt } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  PAYMENT_METHOD_PROVIDER_CONFIG,
  PAYMENT_METHOD_TYPE_LABEL,
  STATUS_CONFIG,
} from '@/data/client/Tenant/RentAndPaymentDashboardData/RentAndPaymentDashboardData';
import { PAGE_LIMIT } from '@/data/common/PaginationData';
import { cn } from '@/lib/utils';
import { useGetRentPaymentsQuery } from '@/store/api/endpoints/client/Tenant/PaymentsApi/PaymentsApi';
import { PaymentStatus } from '@/types/client/Tenant/TenantTypes';
import { formatCurrency, formatDate } from '@/utils/formatters';

const NOT_AVAILABLE = 'Not Available';

function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;

  return (
    <Badge
      variant='outline'
      className={cn('gap-1 font-normal', config.className)}
    >
      <Icon className={cn('h-3.5 w-3.5', status === 'processing')} />
      {config.label}
    </Badge>
  );
}

export function PaymentHistoryTable() {
  const [page, setPage] = useState(1);

  const { data } = useGetRentPaymentsQuery({ page });

  const payments = data?.results ?? [];
  const count = data?.count ?? 0;
  const totalPages = Math.ceil(count / PAGE_LIMIT);

  const getPageNumbers = () => {
    if (totalPages <= 5)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (page <= 3) return [1, 2, 3, 4, '...', totalPages];
    if (page >= totalPages - 2)
      return [
        1,
        '...',
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    return [1, '...', page - 1, page, page + 1, '...', totalPages];
  };

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between'>
        <div>
          <CardTitle className='flex items-center gap-2'>
            <Receipt className='text-primary h-5 w-5' />
            Payment History & Receipts
          </CardTitle>
          <CardDescription>
            A record of your past rent payments.
          </CardDescription>
        </div>
        <span className='text-muted-foreground text-sm'>{count} payments</span>
      </CardHeader>
      <CardContent>
        {payments.length === 0 ? (
          <p className='text-muted-foreground py-8 text-center text-sm'>
            No payments have been recorded yet.
          </p>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Paid Date</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Reference</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.alias}>
                    <TableCell>
                      {payment.paidDate
                        ? formatDate(payment.paidDate)
                        : NOT_AVAILABLE}
                    </TableCell>

                    <TableCell>
                      {payment.paymentMethod ? (
                        <div className='flex items-center gap-2'>
                          {(() => {
                            const Icon =
                              PAYMENT_METHOD_PROVIDER_CONFIG[
                                payment.paymentMethod.provider
                              ]?.icon;
                            return Icon ? (
                              <Icon className='text-muted-foreground h-4 w-4' />
                            ) : null;
                          })()}
                          <div className='flex flex-col leading-tight'>
                            <span>
                              {PAYMENT_METHOD_PROVIDER_CONFIG[
                                payment.paymentMethod.provider
                              ]?.label ?? payment.paymentMethod.provider}
                            </span>
                            <span className='text-muted-foreground text-xs'>
                              {PAYMENT_METHOD_TYPE_LABEL[
                                payment.paymentMethod.methodType
                              ] ?? payment.paymentMethod.methodType}
                            </span>
                          </div>
                        </div>
                      ) : (
                        NOT_AVAILABLE
                      )}
                    </TableCell>
                    <TableCell>{formatCurrency(payment.amount)}</TableCell>
                    <TableCell>
                      <PaymentStatusBadge status={payment.status} />
                    </TableCell>
                    <TableCell>{payment.reference}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className='mt-4 flex items-center justify-between'>
              <p className='text-muted-foreground text-sm whitespace-nowrap'>
                Showing {(page - 1) * PAGE_LIMIT + 1} to{' '}
                {Math.min(page * PAGE_LIMIT, count)} of {count} payments
              </p>
              {totalPages > 1 && (
                <Pagination className='justify-end'>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => page > 1 && setPage((p) => p - 1)}
                        aria-disabled={page === 1}
                        className={
                          page === 1
                            ? 'pointer-events-none opacity-50'
                            : 'cursor-pointer'
                        }
                      />
                    </PaginationItem>

                    {getPageNumbers().map((p, i) =>
                      p === '...' ? (
                        <PaginationItem key={`ellipsis-${i}`}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      ) : (
                        <PaginationItem key={p}>
                          <PaginationLink
                            isActive={p === page}
                            onClick={() => setPage(p as number)}
                            className='cursor-pointer'
                          >
                            {p}
                          </PaginationLink>
                        </PaginationItem>
                      ),
                    )}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          page < totalPages && setPage((p) => p + 1)
                        }
                        aria-disabled={page === totalPages}
                        className={
                          page === totalPages
                            ? 'pointer-events-none opacity-50'
                            : 'cursor-pointer'
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
