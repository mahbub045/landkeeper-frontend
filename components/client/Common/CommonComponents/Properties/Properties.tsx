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
import {
  filterTabs,
  PROPERTY_STATUS_OPTIONS,
  propertyTypeMap,
} from '@/data/client/common/properties/PropertiesData';
import { useGetPropertiesQuery } from '@/store/api/endpoints/client/Common/Properties/PropertiesApi';
import {
  FilterTab,
  Property,
} from '@/types/client/Common/Properties/PropertyTypes';
import { PAGE_LIMIT, SEARCH_DEBOUNCE_MS } from '@/utils/CommonConstants';
import { isLandlord_Admin_LettingAgent } from '@/utils/rolePermissions';
import { Plus, Search } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import AddPropertyDialog from './Dialogs/AddPropertyDialog';
import PropertyFilter from './Propertyfilter/Propertyfilter';
import PropertyGrid from './PropertyGrid/PropertyGrid';

const Properties: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<FilterTab>('All');
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
    ...(propertyTypeMap[activeFilter] && {
      property_type: propertyTypeMap[activeFilter],
    }),
    ...(PROPERTY_STATUS_OPTIONS.find((opt) => opt.label === activeFilter) && {
      status: PROPERTY_STATUS_OPTIONS.find((opt) => opt.label === activeFilter)
        ?.value,
    }),
  };

  const { data, isLoading, isError } = useGetPropertiesQuery(queryParams);

  const properties: Property[] = data?.results ?? [];
  const totalPages = Math.ceil((data?.count ?? 0) / PAGE_LIMIT);

  function handleFilterChange(tab: FilterTab) {
    setActiveFilter(tab);
    setPage(1);
  }

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
            Properties
          </h1>
          <p className='text-muted-foreground text-sm'>
            Manage your property portfolio
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
            <HoverInfoPopover text='You can search using Property Name and Address.' />
          </div>

          {isLandlord_Admin_LettingAgent(session?.user?.role ?? null) && (
            <Button onClick={() => setModalOpen(true)}>
              <Plus />
              Add Property
            </Button>
          )}
        </div>
      </div>

      <PropertyFilter
        filterTabs={filterTabs}
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
      />

      {isError ? (
        <CustomErrorMessage title='properties' />
      ) : (
        <>
          <PropertyGrid
            properties={properties}
            activeFilter={activeFilter}
            isLoading={isLoading}
          />

          <div className='flex items-center justify-between'>
            {(data?.count ?? 0) > 0 && (
              <p className='text-muted-foreground text-sm whitespace-nowrap'>
                Showing {(page - 1) * PAGE_LIMIT + 1} to{' '}
                {Math.min(page * PAGE_LIMIT, data?.count ?? 0)} of{' '}
                {data?.count ?? 0} Properties
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

      <AddPropertyDialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => setModalOpen(false)}
      />
    </div>
  );
};

export default Properties;
