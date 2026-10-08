'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  useGetMarketplaceCategoriesQuery,
  useGetMarketplaceProvidersQuery,
} from '@/store/api/endpoints/super-admin/Marketplace/MarketplaceApi';
import { PAGE_LIMIT, SEARCH_DEBOUNCE_MS } from '@/utils/commonConstants.ts';
import { Handshake, Info, Search, SearchX, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import CategoryCards from './CategoryCards/CategoryCards';
import HowItWorksDialog from './Dialogs/HowItWorksDialog';
import MarketplacePagination from './MarketplacePagination/MarketplacePagination';
import ServiceCard from './ServiceCard/ServiceCard';

const Marketplace: React.FC = () => {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [category, setCategory] = useState<string>('ALL');
  const [page, setPage] = useState(1);
  const [howItWorksOpen, setHowItWorksOpen] = useState(false);
  const servicesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(
      () => setDebouncedSearch(search.trim()),
      SEARCH_DEBOUNCE_MS,
    );
    return () => clearTimeout(timer);
  }, [search]);

  const isFiltering = search.trim() !== '' || category !== 'ALL';

  const {
    data: categories,
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
  } = useGetMarketplaceCategoriesQuery();
  const {
    data: providers,
    isFetching: isProvidersFetching,
    isError: isProvidersError,
  } = useGetMarketplaceProvidersQuery({
    page,
    page_size: PAGE_LIMIT,
    ...(debouncedSearch && { search: debouncedSearch }),
    ...(category !== 'ALL' && { categories__slug: category }),
  });

  const services = providers?.results ?? [];
  const totalCount = providers?.count ?? 0;

  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1);
  }

  function handleCategoryChange(value: string) {
    setCategory(value);
    setPage(1);
  }

  function handlePageChange(value: number) {
    setPage(value);
    servicesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  function clearFilters() {
    setSearch('');
    setCategory('ALL');
    setPage(1);
  }

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-foreground text-2xl font-bold tracking-tight'>
          Marketplace
        </h1>
        <p className='text-muted-foreground max-w-3xl text-sm'>
          Find trusted third-party services to help you manage your properties.
          From maintenance and compliance to insurance and legal support, all in
          one place.
        </p>
      </div>

      {/* Trusted services banner */}
      <div className='border-primary/15 bg-primary/5 flex flex-col gap-4 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5'>
        <div className='flex items-center gap-4'>
          <div className='bg-primary/15 flex size-12 shrink-0 items-center justify-center rounded-full'>
            <Handshake className='text-primary size-6' />
          </div>
          <div>
            <p className='text-foreground font-semibold'>
              Trusted services for landlords
            </p>
            <p className='text-muted-foreground text-sm'>
              Access reliable, professional companies that understand your
              property needs.
            </p>
          </div>
        </div>
        <Button
          variant='outline'
          onClick={() => setHowItWorksOpen(true)}
          className='text-primary bg-card shrink-0'
        >
          <Info />
          How the Marketplace works
        </Button>
      </div>

      {/* Search & filters */}
      <div className='flex items-center justify-between gap-4'>
        <div>
          <h2 className='text-foreground text-lg font-bold tracking-tight'>
            Search & Filters
          </h2>
          <p className='text-muted-foreground text-sm'>
            Find services by name, category or location.
          </p>
        </div>
        <div className='relative w-full sm:w-96'>
          <Search className='text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2' />
          <Input
            type='text'
            placeholder='Search for a service...'
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className='bg-card h-10! w-full pr-9! pl-9!'
          />
          {search && (
            <button
              type='button'
              onClick={() => handleSearchChange('')}
              className='text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer'
              aria-label='Clear search'
            >
              <X className='size-4' />
            </button>
          )}
        </div>
      </div>

      <CategoryCards
        categories={categories}
        isLoading={isCategoriesLoading}
        isError={isCategoriesError}
        selected={category}
        onSelect={handleCategoryChange}
      />

      {/* Services */}
      <div ref={servicesRef} className='scroll-mt-6 space-y-4'>
        <div className='flex items-center justify-between gap-3'>
          <h2 className='text-foreground text-lg font-bold tracking-tight'>
            {isFiltering
              ? `${totalCount} ${totalCount === 1 ? 'Service' : 'Services'} Found`
              : 'All Services'}
          </h2>
          {isFiltering && (
            <Button
              variant='link'
              onClick={clearFilters}
              className='h-auto p-0 text-sm'
            >
              Clear filters
            </Button>
          )}
        </div>

        {isProvidersFetching ? (
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4'>
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className='h-80 rounded-xl' />
            ))}
          </div>
        ) : isProvidersError ? (
          <div className='border-border bg-card flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-4 py-12 text-center'>
            <p className='text-foreground font-semibold'>
              Couldn&apos;t load services
            </p>
            <p className='text-muted-foreground text-sm'>
              Please try again later.
            </p>
          </div>
        ) : services.length > 0 ? (
          <>
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4'>
              {services.map((provider) => (
                <ServiceCard key={provider.alias} provider={provider} />
              ))}
            </div>
            <MarketplacePagination
              page={page}
              pageSize={PAGE_LIMIT}
              totalCount={totalCount}
              onPageChange={handlePageChange}
            />
          </>
        ) : (
          <div className='border-border bg-card flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-4 py-12 text-center'>
            <SearchX className='text-muted-foreground size-8' />
            <p className='text-foreground font-semibold'>No services found</p>
            <p className='text-muted-foreground text-sm'>
              Try a different search term, category or area.
            </p>
          </div>
        )}
      </div>

      <HowItWorksDialog
        open={howItWorksOpen}
        onClose={() => setHowItWorksOpen(false)}
      />
    </div>
  );
};

export default Marketplace;
