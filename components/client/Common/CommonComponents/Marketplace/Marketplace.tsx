'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  STATUS_FILTER_OPTIONS,
  VERIFIED_FILTER_OPTIONS,
} from '@/data/super-admin/Marketplace/MarketplaceData';
import {
  useGetMarketplaceCategoriesQuery,
  useGetMarketplaceProvidersQuery,
} from '@/store/api/endpoints/super-admin/Marketplace/MarketplaceApi';
import { MarketplaceBooleanFilter } from '@/types/super-admin/Marketplace/MarketplaceTypes';
import { PAGE_LIMIT, SEARCH_DEBOUNCE_MS } from '@/utils/commonConstants.ts';
import { Handshake, Info, Search, SearchX } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import CategoryCards from './CategoryCards/CategoryCards';
import HowItWorksDialog from './Dialogs/HowItWorksDialog';
import MarketplaceFilterSelect from './MarketplaceFilterSelect/MarketplaceFilterSelect';
import MarketplacePagination from './MarketplacePagination/MarketplacePagination';
import ServiceCard from './ServiceCard/ServiceCard';

const Marketplace: React.FC = () => {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [category, setCategory] = useState<string>('ALL');
  const [verified, setVerified] = useState<MarketplaceBooleanFilter>('ALL');
  const [status, setStatus] = useState<MarketplaceBooleanFilter>('ALL');
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

  const isFiltering =
    search.trim() !== '' ||
    category !== 'ALL' ||
    verified !== 'ALL' ||
    status !== 'ALL';

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
    ...(verified !== 'ALL' && { is_verified: verified === 'true' }),
    ...(status !== 'ALL' && { is_active: status === 'true' }),
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

  function handleFilterChange(
    setter: (value: MarketplaceBooleanFilter) => void,
  ) {
    return (value: MarketplaceBooleanFilter) => {
      setter(value);
      setPage(1);
    };
  }

  function handlePageChange(value: number) {
    setPage(value);
    servicesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  function clearFilters() {
    setSearch('');
    setCategory('ALL');
    setVerified('ALL');
    setStatus('ALL');
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
      <div className='flex flex-col gap-3 lg:flex-row'>
        <div className='relative min-w-0 flex-1'>
          <Search className='text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2' />
          <Input
            type='text'
            placeholder='Search for a service (e.g. boiler repair, compliance, insurance...)'
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className='bg-card h-10! w-full pl-9!'
          />
        </div>

        <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 lg:flex'>
          <MarketplaceFilterSelect
            label='Verified'
            value={verified}
            options={VERIFIED_FILTER_OPTIONS}
            onChange={handleFilterChange(setVerified)}
          />
          <MarketplaceFilterSelect
            label='Status'
            value={status}
            options={STATUS_FILTER_OPTIONS}
            onChange={handleFilterChange(setStatus)}
          />
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
