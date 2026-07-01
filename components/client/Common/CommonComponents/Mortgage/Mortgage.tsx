'use client';

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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useGetMortgagesQuery } from '@/store/api/endpoints/client/Common/Mortgage/MortgageApi';
import { Info, Plus, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import AddMortgageDialog from './Dialogs/AddMortgageDialog';
import MortgageList from './MortgageList/MortgageList';
import SummaryCards from './SummaryCards/SummaryCards';

const PAGE_LIMIT = 12;

const Mortgage: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
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
            Mortgages
          </h1>
          <p className='text-muted-foreground text-sm'>
            Track and manage your property financing
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <div className='relative w-64'>
            <Search className='text-muted-foreground absolute top-1/2 left-2 size-4 -translate-y-1/2' />
            <Input
              type='text'
              placeholder='Search...'
              value={search}
              onChange={handleSearchChange}
              className='h-8! w-64 pr-8! pl-7!'
            />
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type='button'
                  className='absolute top-1/2 right-2 flex size-4 -translate-y-1/2 items-center justify-center rounded-full'
                >
                  <Info className='size-3' />
                </button>
              </PopoverTrigger>
              <PopoverContent className='w-72 p-3' align='end'>
                <p className='text-muted-foreground flex items-start gap-2 text-sm'>
                  <Search className='mt-0.5 size-4 shrink-0' />
                  <small className=''>
                    You can search using Property Name and Lender Name.
                  </small>
                </p>
              </PopoverContent>
            </Popover>
          </div>

          <Button onClick={() => setModalOpen(true)}>
            <Plus />
            Add Mortgage
          </Button>
        </div>
      </div>

      <SummaryCards data={data?.results ?? []} />

      {isError ? (
        <p className='text-danger text-sm'>
          Failed to load mortgages. Please try again.
        </p>
      ) : (
        <>
          <MortgageList mortgages={data?.results ?? []} isLoading={isLoading} />

          {totalPages > 1 && (
            <div className='flex items-center justify-between'>
              <p className='text-muted-foreground text-sm whitespace-nowrap'>
                Showing {(page - 1) * PAGE_LIMIT + 1} to{' '}
                {Math.min(page * PAGE_LIMIT, data?.count ?? 0)} of{' '}
                {data?.count ?? 0} Mortgages
              </p>

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
            </div>
          )}
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
