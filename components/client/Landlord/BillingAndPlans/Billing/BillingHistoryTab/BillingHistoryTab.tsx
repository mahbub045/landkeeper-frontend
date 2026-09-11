'use client';

import { Button } from '@/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { useDownloadFile } from '@/hooks/useDownloadFile';
import { cn } from '@/lib/utils';
import { useBillingHistoryQuery } from '@/store/api/endpoints/client/Landlord/BillingAndPlans/Billing/BillingApi';
import { BillingHistoryResponse } from '@/types/client/Landlord/BillingAndPlans/BillingType';
import { PAGE_LIMIT } from '@/utils/CommonConstants';
import formatChoiceFieldValue, {
  formatDateAndTime,
  getCurrencySign,
} from '@/utils/formatters';
import { Download, Receipt } from 'lucide-react';
import { useState } from 'react';

export const statusDotStyles: Record<string, string> = {
  PENDING: 'bg-amber-500',
  SUCCEEDED: 'bg-emerald-500',
  FAILED: 'bg-destructive',
  PARTIALLY_REFUNDED: 'bg-blue-400',
  REFUNDED: 'bg-blue-500',
};

export const statusBGStyles: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-800',
  SUCCEEDED: 'bg-emerald-100 text-emerald-800',
  FAILED: 'bg-destructive/10 text-destructive',
  PARTIALLY_REFUNDED: 'bg-blue-100 text-blue-800',
  REFUNDED: 'bg-blue-100 text-blue-800',
};

export default function BillingHistoryTab() {
  const [page, setPage] = useState(1);
  const { downloadFile, isDownloading } = useDownloadFile();

  const { data, isLoading, isError } = useBillingHistoryQuery({
    page,
  }) as {
    data: BillingHistoryResponse | undefined;
    isLoading: boolean;
    isError: boolean;
  };

  const invoices = data?.results ?? [];
  const totalCount = data?.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_LIMIT));

  const getPageNumbers = (): (number | '...')[] => {
    const pages: (number | '...')[] = [];
    const delta = 1;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= page - delta && i <= page + delta)
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== '...') {
        pages.push('...');
      }
    }

    return pages;
  };

  if (isLoading) {
    return (
      <div className='border-border/70 rounded-2xl border bg-white p-6 dark:bg-white/4'>
        <div className='bg-muted mb-5 h-5 w-32 animate-pulse rounded' />
        <div className='space-y-2'>
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className='bg-muted h-10 w-full animate-pulse rounded'
            />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className='border-destructive/40 bg-destructive/5 rounded-2xl border border-dashed px-6 py-10 text-center'>
        <p className='font-medium'>Could not load your billing history.</p>
        <p className='text-muted-foreground mt-1 text-sm'>
          Please refresh and try again.
        </p>
      </div>
    );
  }

  return (
    <div className='border-border/70 rounded-2xl border bg-white p-6 dark:bg-white/4'>
      <p className='mb-5 text-sm font-semibold'>Billing history</p>

      {invoices.length === 0 ? (
        <div className='border-border/70 flex flex-col items-center justify-center rounded-xl border border-dashed py-14 text-center'>
          <Receipt
            className='text-muted-foreground mb-3 size-8'
            aria-hidden='true'
          />
          <p className='font-medium'>No invoices yet</p>
          <p className='text-muted-foreground mt-1 max-w-xs text-sm'>
            Your invoices will show up here after your first billed payment.
          </p>
        </div>
      ) : (
        <>
          <div className='border-border/70 overflow-hidden rounded-xl border'>
            <table className='w-full text-sm'>
              <thead className='bg-muted/60 text-muted-foreground text-xs font-semibold tracking-wide'>
                <tr>
                  <th className='px-4 py-3 text-left'>Date</th>
                  <th className='px-4 py-3 text-center'>Plan</th>
                  <th className='px-4 py-3 text-center'>Amount</th>
                  <th className='px-4 py-3 text-center'>Status</th>
                  <th className='px-4 py-3 text-center'>Receipt</th>
                </tr>
              </thead>
              <tbody className='divide-border/70 divide-y'>
                {invoices.map((invoice) => (
                  <tr key={invoice.alias}>
                    <td className='px-4 py-3 whitespace-nowrap'>
                      {formatDateAndTime(invoice.created_at)}
                    </td>
                    <td className='px-4 py-3 text-center'>
                      {invoice.plan_name}
                    </td>
                    <td className='px-4 py-3 text-center font-medium whitespace-nowrap'>
                      {getCurrencySign()}
                      {invoice.amount}
                    </td>
                    <td className='px-4 py-3 text-center'>
                      <span
                        className={`border-border/70 inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium ${statusBGStyles[invoice.status] ?? 'bg-muted-foreground'}`}
                      >
                        <span
                          className={cn(
                            'size-1.5 rounded-full',
                            statusDotStyles[invoice.status] ??
                              'bg-muted-foreground',
                          )}
                        />
                        {formatChoiceFieldValue(invoice.status)}
                      </span>
                    </td>
                    <td className='px-4 py-3 text-center'>
                      <Button
                        size='sm'
                        variant='outline'
                        onClick={() =>
                          downloadFile({
                            url: invoice.invoice_pdf_url,
                            filename: `${invoice.plan_name.replace(/\s+/g, '-').toLowerCase()}.pdf`,
                          })
                        }
                      >
                        <Download className='size-4' />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className='mt-5 flex items-center justify-between'>
            {totalCount > 0 && (
              <p className='text-muted-foreground text-sm whitespace-nowrap'>
                Showing {(page - 1) * PAGE_LIMIT + 1} to{' '}
                {Math.min(page * PAGE_LIMIT, totalCount)} of {totalCount}{' '}
                invoices
              </p>
            )}
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
                      onClick={() => page < totalPages && setPage((p) => p + 1)}
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
    </div>
  );
}
