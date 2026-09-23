'use client';

import CustomErrorMessage from '@/components/common/CustomErrorMessage/CustomErrorMessage';
import HoverInfoPopover from '@/components/common/HoverInfoPopover/HoverInfoPopover';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { STATUS_CONFIG } from '@/data/client/common/tenant/TenantPaymentsData';
import { cn } from '@/lib/utils';
import { useGetTenantPaymentsQuery } from '@/store/api/endpoints/client/Common/Tenant/TenantPaymentsApi';
import { TenantPaymentType } from '@/types/client/Common/Tenant/TenantPaymentsType';
import { PAGE_LIMIT, SEARCH_DEBOUNCE_MS } from '@/utils/CommonConstants';
import { Receipt, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import TenantPaymentTableRow from './TenantPaymentTableRow';

const STATUS_FILTER_OPTIONS = [
  { value: 'all', label: 'All Statuses', config: null },
  ...Object.entries(STATUS_CONFIG).map(([value, config]) => ({
    value,
    label: config.label,
    config,
  })),
];

const TABLE_COLUMN = [
  { key: 'id', label: 'ID', align: 'left' },
  { key: 'date', label: 'Payment Date', align: 'left' },
  { key: 'tenant', label: 'Tenant', align: 'left' },
  { key: 'property', label: 'Property', align: 'left' },
  { key: 'amount', label: 'Amount', align: 'center' },
  { key: 'dueDate', label: 'Due Date', align: 'center' },
  { key: 'status', label: 'Status', align: 'center' },
  { key: 'card', label: 'Card', align: 'center' },
  { key: 'invoice', label: 'Invoice', align: 'center' },
  { key: 'actions', label: 'Actions', align: 'center' },
] as const;

const TenantPayments: React.FC = () => {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(
      () => setDebouncedSearch(search),
      SEARCH_DEBOUNCE_MS,
    );
    return () => clearTimeout(timer);
  }, [search]);

  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1);
  }

  function handleStatusChange(value: string) {
    setStatus(value);
    setPage(1);
  }

  const queryParams = {
    page,
    page_size: PAGE_LIMIT,
    ...(debouncedSearch && { search: debouncedSearch }),
    ...(status !== 'all' && { status }),
  };

  const {
    data: tenantPayments,
    isLoading,
    isError,
  } = useGetTenantPaymentsQuery(queryParams);

  const payments: TenantPaymentType[] = tenantPayments?.results ?? [];
  const count = tenantPayments?.count ?? 0;
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
    <div className='space-y-6'>
      <div className='flex items-start justify-between'>
        <div>
          <h1 className='text-foreground flex items-center gap-2 text-2xl font-bold tracking-tight'>
            <Receipt className='text-primary h-6 w-6' />
            Tenant Payments
          </h1>
          <p className='text-muted-foreground text-sm'>
            A record of rent payments across all tenants.
          </p>
        </div>
      </div>

      {isError ? (
        <CustomErrorMessage title='tenant payments' />
      ) : (
        <>
          <Card className='border-border overflow-hidden rounded-2xl pt-0 shadow-sm'>
            <div className='border-border flex flex-col gap-3 border-b px-6 py-4 sm:flex-row sm:items-center sm:justify-between'>
              <h2 className='text-foreground text-base font-semibold'>
                All Payments
              </h2>
              <div className='flex flex-col gap-2 sm:flex-row sm:items-center'>
                <Select value={status} onValueChange={handleStatusChange}>
                  <SelectTrigger className='h-9! w-full rounded-xl focus-visible:ring-0 sm:w-40'>
                    <SelectValue placeholder='Status' />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_FILTER_OPTIONS.map((opt) => {
                      const Icon = opt.config?.icon;
                      return (
                        <SelectItem key={opt.value} value={opt.value}>
                          <span
                            className={cn(
                              'flex items-center gap-2',
                              opt.config &&
                                opt.config.className
                                  .split(' ')
                                  .find((c) => c.startsWith('text-')),
                            )}
                          >
                            {Icon && <Icon className='size-3.5' />}
                            {opt.label}
                          </span>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>

                <div className='relative w-full sm:w-64'>
                  <Search className='text-muted-foreground absolute top-1/2 left-2 size-4 -translate-y-1/2' />
                  <Input
                    type='text'
                    placeholder='Search payments...'
                    value={search}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className='h-9! w-full rounded-xl pr-8! pl-7!'
                  />
                  <HoverInfoPopover text='You can search using Tenant Name, Property Name and Anount.' />
                </div>
              </div>
            </div>

            <div className='overflow-x-auto'>
              <Table>
                <TableHeader>
                  <TableRow>
                    {TABLE_COLUMN.map((col) => (
                      <TableHead
                        key={col.key}
                        className={cn(
                          'px-6',
                          col.align === 'center' && 'text-center',
                        )}
                      >
                        {col.label}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, rowIdx) => (
                      <TableRow key={rowIdx}>
                        {TABLE_COLUMN.map((col) => (
                          <TableCell
                            key={col.key}
                            className={cn(
                              'px-6',
                              col.align === 'center' && 'text-center',
                            )}
                          >
                            {col.key === 'status' ? (
                              <Skeleton className='mx-auto h-6 w-20 animate-pulse rounded-full' />
                            ) : col.key === 'card' ? (
                              <div className='flex items-center justify-center gap-2'>
                                <Skeleton className='h-8 w-8 animate-pulse rounded-md' />
                                <Skeleton className='h-4 w-16 animate-pulse rounded-md' />
                              </div>
                            ) : col.key === 'actions' || col.key === 'invoice' ? (
                              <Skeleton className='mx-auto h-8 w-8 animate-pulse rounded-lg' />
                            ) : col.key === 'property' ? (
                              <div className='flex flex-col gap-1.5'>
                                <Skeleton className='h-4 w-28 animate-pulse rounded-md' />
                                <Skeleton className='h-3 w-20 animate-pulse rounded-md' />
                              </div>
                            ) : (
                              <Skeleton
                                className={cn(
                                  'h-4 animate-pulse rounded-md',
                                  col.align === 'center' ? 'mx-auto' : '',
                                  col.key === 'id'
                                    ? 'w-6'
                                    : col.key === 'amount'
                                      ? 'w-16'
                                      : 'w-24',
                                )}
                              />
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : payments.length > 0 ? (
                    payments.map((payment, idx) => (
                      <TenantPaymentTableRow
                        key={payment.alias}
                        payment={payment}
                        rowNumber={(page - 1) * PAGE_LIMIT + idx + 1}
                        columnCount={TABLE_COLUMN.length}
                      />
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={TABLE_COLUMN.length}
                        className='py-16 text-center'
                      >
                        <div className='text-muted-foreground flex flex-col items-center justify-center gap-2'>
                          <Receipt className='size-10' />
                          <span className='text-sm'>No payments found</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>

          <div className='flex items-center justify-between'>
            {count > 0 && (
              <p className='text-muted-foreground text-sm whitespace-nowrap'>
                Showing {(page - 1) * PAGE_LIMIT + 1} to{' '}
                {Math.min(page * PAGE_LIMIT, count)} of {count} payments
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
};

export default TenantPayments;
