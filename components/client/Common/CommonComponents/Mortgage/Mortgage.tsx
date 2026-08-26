'use client';

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
import { Skeleton } from '@/components/ui/skeleton';
import { useGetMortgagesQuery } from '@/store/api/endpoints/client/Common/Mortgage/MortgageApi';
import { PAGE_LIMIT, SEARCH_DEBOUNCE_MS } from '@/utils/CommonConstants';
import { isLandlord_Admin_LettingAgent } from '@/utils/rolePermissions';
import { Plus, Search } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import AddMortgageDialog from './Dialogs/AddMortgageDialog';
import MortgageList from './MortgageList/MortgageList';
import SummaryCards from './SummaryCards/SummaryCards';

// Skeleton for the summary stat cards row (matches a typical 4-card grid).
function SummaryCardsSkeleton() {
  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className='border-border bg-card space-y-3 rounded-xl border p-4'
        >
          <Skeleton className='h-4 w-24' />
          <Skeleton className='h-7 w-32' />
          <Skeleton className='h-3 w-20' />
        </div>
      ))}
    </div>
  );
}

// Skeleton for a single mortgage card — mirrors MortgageList's card layout:
function MortgageCardSkeleton() {
  return (
    <div className='border-border bg-card space-y-4 rounded-xl border p-4 shadow-sm'>
      <div className='flex items-start justify-between'>
        <Skeleton className='h-3.5 w-28' />
        <Skeleton className='h-5 w-14 rounded-full' />
      </div>

      <div className='space-y-1.5'>
        <Skeleton className='h-5 w-40' />
        <Skeleton className='h-3.5 w-20' />
      </div>

      <div className='flex items-end justify-between'>
        <div className='space-y-1.5'>
          <Skeleton className='h-7 w-20' />
          <Skeleton className='h-3 w-28' />
        </div>
        <div className='space-y-1.5 text-right'>
          <Skeleton className='ml-auto h-5 w-10' />
          <Skeleton className='ml-auto h-3 w-16' />
        </div>
      </div>

      <div className='border-border border-t pt-3'>
        <Skeleton className='h-3.5 w-24' />
      </div>
    </div>
  );
}

// Grid of mortgage card skeletons while data is loading.
function MortgageListSkeleton() {
  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
      {Array.from({ length: 6 }).map((_, i) => (
        <MortgageCardSkeleton key={i} />
      ))}
    </div>
  );
}

const Mortgage: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const { data: session } = useSession();

  useEffect(() => {
    const timer = setTimeout(
      () => setDebouncedSearch(search),
      SEARCH_DEBOUNCE_MS,
    );
    return () => clearTimeout(timer);
  }, [search]);

  const queryParams = {
    page,
    page_size: PAGE_LIMIT,
    ...(debouncedSearch && { search: debouncedSearch }),
  };

  const { data, isLoading, isError } = useGetMortgagesQuery(queryParams);

  const totalPages = Math.ceil((data?.count ?? 0) / PAGE_LIMIT);

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value);
    setPage(1);
  }

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
      <div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
        <div>
          <h1 className='text-foreground text-2xl font-bold tracking-tight'>
            Mortgage overview
          </h1>
          <p className='text-muted-foreground text-sm'>
            Manage your mortgages and track their details in one place.
          </p>
        </div>
      </div>

      {isLoading ? (
        <SummaryCardsSkeleton />
      ) : (
        <SummaryCards data={data?.results ?? []} />
      )}

      <div className='mt-15 flex flex-col gap-4 md:flex-row md:items-start md:justify-between'>
        <div className='min-w-0'>
          <h1 className='text-foreground text-2xl font-bold tracking-tight'>
            Mortgages
          </h1>
          <p className='text-muted-foreground text-sm'>
            Track and manage your property financing
          </p>
        </div>

        <div className='flex w-full flex-col gap-2 min-[400px]:flex-row md:w-auto'>
          <div className='relative min-w-0 flex-1 min-[400px]:max-w-xs md:w-64 md:flex-none'>
            <Search className='text-muted-foreground absolute top-1/2 left-2 size-4 -translate-y-1/2' />
            <Input
              type='text'
              placeholder='Search...'
              value={search}
              onChange={handleSearchChange}
              className='h-8! w-full pr-8! pl-7!'
            />
            <HoverInfoPopover text='You can search using Property Name and Lender Name.' />
          </div>
          {isLandlord_Admin_LettingAgent(session?.user?.role ?? null) && (
            <Button
              onClick={() => setModalOpen(true)}
              className='w-full shrink-0 min-[400px]:w-auto'
            >
              <Plus />
              Add Mortgage
            </Button>
          )}
        </div>
      </div>

      {isLoading && <MortgageListSkeleton />}

      {!isLoading && isError && <CustomErrorMessage title='mortgages' />}

      {!isLoading && !isError && (
        <>
          <MortgageList mortgages={data?.results ?? []} isLoading={isLoading} />

          <div className='flex flex-wrap items-center justify-between gap-3'>
            {(data?.count ?? 0) > 0 && (
              <p className='text-muted-foreground text-sm whitespace-nowrap'>
                Showing {(page - 1) * PAGE_LIMIT + 1} to{' '}
                {Math.min(page * PAGE_LIMIT, data?.count ?? 0)} of{' '}
                {data?.count ?? 0} Mortgages
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

      <AddMortgageDialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => setModalOpen(false)}
        properties={[]}
      />
    </div>
  );
};

export default Mortgage;
