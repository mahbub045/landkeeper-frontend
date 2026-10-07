'use client';

import { ListFilter, Search, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

import CustomErrorMessage from '@/components/common/CustomErrorMessage/CustomErrorMessage';
import HoverInfoPopover from '@/components/common/HoverInfoPopover/HoverInfoPopover';
import { Button } from '@/components/ui/button';
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
import { cn } from '@/lib/utils';
import { useGetLandlordsQuery } from '@/store/api/endpoints/super-admin/Landlords/Overview/OverviewApi';
import { LandlordFilterValues } from '@/types/super-admin/Landlords/Overview/OverviewType';
import { PAGE_LIMIT, SEARCH_DEBOUNCE_MS } from '@/utils/commonConstants.ts';
import LandlordCard from './LandlordCard';
import LandlordCardSkeleton from './LandlordCardSkeleton';
import LandlordFilters, {
  countActiveLandlordFilters,
  DEFAULT_LANDLORD_FILTERS,
} from './LandlordFilters';

const LandlordList: React.FC = () => {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filters, setFilters] = useState<LandlordFilterValues>(
    DEFAULT_LANDLORD_FILTERS,
  );
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(
      () => setDebouncedSearch(search.trim()),
      SEARCH_DEBOUNCE_MS,
    );
    return () => clearTimeout(timer);
  }, [search]);

  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1);
  }

  function handleFiltersChange(value: LandlordFilterValues) {
    setFilters(value);
    setPage(1);
  }

  const activeFilterCount = countActiveLandlordFilters(filters);
  const hasFilters = activeFilterCount > 0;

  const { data, isLoading, isFetching, isError } = useGetLandlordsQuery({
    page,
    page_size: PAGE_LIMIT,
    ...(debouncedSearch && { search: debouncedSearch }),
    ...(filters.is_active !== 'all' && {
      is_active: filters.is_active === 'true',
    }),
    ...(filters.subscription_status !== 'all' && {
      organisation_users__organisation__subscription__status:
        filters.subscription_status,
    }),
    ...(filters.plan_type !== 'all' && {
      organisation_users__organisation__subscription__plan__plan_type:
        filters.plan_type,
    }),
    ...(filters.created_at_from && {
      created_at__gte: filters.created_at_from,
    }),
    ...(filters.created_at_to && { created_at__lte: filters.created_at_to }),
  });

  const landlords = data?.results ?? [];
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
    <div className='space-y-6'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
        <div>
          <h1 className='text-foreground flex items-center gap-2 text-2xl font-bold tracking-tight'>
            <Users className='text-primary h-6 w-6' />
            Landlords
          </h1>
          <p className='text-muted-foreground text-sm'>
            All landlords registered on Landkeeper and their subscriptions.
          </p>
        </div>

        <div className='flex w-full items-center gap-2 sm:w-auto'>
          <div className='relative w-full sm:w-72'>
            <Search className='text-muted-foreground absolute top-1/2 left-2 size-4 -translate-y-1/2' />
            <Input
              type='text'
              placeholder='Type to search...'
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className='h-9! w-full rounded-xl pr-8! pl-7!'
            />
            <HoverInfoPopover text='You can search using Landlord Name, Phone and Email.' />
          </div>

          <Button
            type='button'
            variant='outline'
            size='icon'
            aria-label={showFilters ? 'Hide filters' : 'Show filters'}
            aria-expanded={showFilters}
            title='Filters'
            onClick={() => setShowFilters((v) => !v)}
            className={cn(
              'relative size-9 shrink-0 rounded-xl',
              (showFilters || hasFilters) &&
                'border-primary text-primary bg-primary/10',
            )}
          >
            <ListFilter className='size-4' />
            {hasFilters && (
              <span className='bg-primary text-primary-foreground absolute -top-1.5 -right-1.5 flex size-4 items-center justify-center rounded-full text-[10px] font-semibold'>
                {activeFilterCount}
              </span>
            )}
          </Button>
        </div>
      </div>

      {showFilters && (
        <LandlordFilters filters={filters} onChange={handleFiltersChange} />
      )}

      {isError ? (
        <CustomErrorMessage title='landlords' />
      ) : isLoading || isFetching ? (
        <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'>
          {Array.from({ length: 12 }).map((_, i) => (
            <LandlordCardSkeleton key={i} />
          ))}
        </div>
      ) : landlords.length === 0 ? (
        <div className='border-border flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed py-16 text-center'>
          <Users className='text-muted-foreground size-8' />
          <p className='text-muted-foreground text-sm'>
            {debouncedSearch
              ? `No landlords match "${debouncedSearch}".`
              : hasFilters
                ? 'No landlords match the selected filters.'
                : 'No landlords found.'}
          </p>
        </div>
      ) : (
        <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'>
          {landlords.map((landlord) => (
            <LandlordCard key={landlord.alias} landlord={landlord} />
          ))}
        </div>
      )}

      {!isError && count > 0 && (
        <div className='flex flex-col items-center justify-between gap-3 sm:flex-row'>
          <p className='text-muted-foreground text-sm whitespace-nowrap'>
            Showing {(page - 1) * PAGE_LIMIT + 1} to{' '}
            {Math.min(page * PAGE_LIMIT, count)} of {count} landlords
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
      )}
    </div>
  );
};

export default LandlordList;
