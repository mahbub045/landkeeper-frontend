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
import { useGetPropertiesQuery } from '@/store/api/endpoints/client/Common/Properties/PropertiesApi';
import {
  FilterTab,
  Property,
} from '@/types/client/Common/Properties/PropertyTypes';
import { Plus, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import AddPropertyDialog from './Dialogs/AddPropertyDialog';
import PropertyFilter from './Propertyfilter/Propertyfilter';
import PropertyGrid from './PropertyGrid/PropertyGrid';

const PAGE_LIMIT = 12;

const filterTabs: FilterTab[] = [
  'All',
  'Residential',
  'HMO',
  'Commercial',
  'Mixed Use',
  'Holiday Let',
  'Occupied',
  'Vacant',
  'Under Maintenance',
];

const propertyTypeMap: Partial<Record<FilterTab, string>> = {
  Residential: 'RESIDENTIAL',
  HMO: 'HMO',
  Commercial: 'COMMERCIAL',
  'Mixed Use': 'MIXED_USE',
  'Holiday Let': 'HOLIDAY_LET',
};

const statusMap: Partial<Record<FilterTab, string>> = {
  Occupied: 'OCCUPIED',
  Vacant: 'VACANT',
  'Under Maintenance': 'UNDER_MAINTENANCE',
};

const Properties: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<FilterTab>('All');
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
    ...(propertyTypeMap[activeFilter] && {
      property_type: propertyTypeMap[activeFilter],
    }),
    ...(statusMap[activeFilter] && { status: statusMap[activeFilter] }),
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
      <div className='flex items-start justify-between gap-4'>
        <div>
          <h1 className='text-foreground text-2xl font-bold tracking-tight'>
            Properties
          </h1>
          <p className='text-muted-foreground text-sm'>
            Manage your property portfolio
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <div className='relative'>
            <Input
              type='text'
              placeholder='Search properties...'
              value={search}
              onChange={handleSearchChange}
              className='w-64 pl-9'
            />
          </div>
          <Button variant='default' onClick={() => setModalOpen(true)}>
            <Plus />
            Add Property
          </Button>
        </div>
      </div>

      <PropertyFilter
        filterTabs={filterTabs}
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
      />

      {isError ? (
        <p className='text-danger text-sm'>
          Failed to load properties. Please try again.
        </p>
      ) : (
        <>
          <PropertyGrid
            properties={properties}
            activeFilter={activeFilter}
            isLoading={isLoading}
          />
          {totalPages > 1 && (
            <Pagination>
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
