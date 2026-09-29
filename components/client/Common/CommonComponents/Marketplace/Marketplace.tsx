'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AREA_OPTIONS,
  MARKETPLACE_CATEGORIES,
  MARKETPLACE_SERVICES,
  SORT_OPTIONS,
} from '@/data/client/common/marketplace/MarketplaceData';
import {
  MarketplaceCategoryKey,
  MarketplaceCoverage,
  MarketplaceSort,
} from '@/types/client/Common/Marketplace/MarketplaceTypes';
import { Handshake, Info, Search, SearchX } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import CategoryCards from './CategoryCards/CategoryCards';
import HowItWorksDialog from './Dialogs/HowItWorksDialog';
import PopularServices from './PopularServices/PopularServices';
import ServiceCard from './ServiceCard/ServiceCard';

const Marketplace: React.FC = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<MarketplaceCategoryKey | 'ALL'>(
    'ALL',
  );
  const [area, setArea] = useState<MarketplaceCoverage | 'ALL'>('ALL');
  const [sort, setSort] = useState<MarketplaceSort>('RECOMMENDED');
  const [viewAll, setViewAll] = useState(false);
  const [howItWorksOpen, setHowItWorksOpen] = useState(false);
  const servicesRef = useRef<HTMLDivElement>(null);

  const isFiltering =
    search.trim() !== '' || category !== 'ALL' || area !== 'ALL';

  const services = useMemo(() => {
    const term = search.trim().toLowerCase();

    const filtered = MARKETPLACE_SERVICES.filter((service) => {
      if (!isFiltering && !viewAll && !service.featured) return false;
      if (category !== 'ALL' && service.category !== category) return false;
      if (
        area !== 'ALL' &&
        service.coverage !== 'NATIONWIDE' &&
        service.coverage !== area
      )
        return false;
      if (
        term &&
        ![service.name, service.description, service.brand_tagline]
          .join(' ')
          .toLowerCase()
          .includes(term)
      )
        return false;
      return true;
    });

    if (sort === 'RATING')
      return [...filtered].sort((a, b) => b.rating - a.rating);
    if (sort === 'REVIEWS')
      return [...filtered].sort((a, b) => b.review_count - a.review_count);
    return filtered;
  }, [search, category, area, sort, viewAll, isFiltering]);

  function handlePopularSelect(term: string) {
    setSearch(term);
    setCategory('ALL');
    servicesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function clearFilters() {
    setSearch('');
    setCategory('ALL');
    setArea('ALL');
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
            onChange={(e) => setSearch(e.target.value)}
            className='bg-card h-10! w-full pl-9!'
          />
        </div>

        <div className='grid grid-cols-1 gap-3 sm:grid-cols-3 lg:flex'>
          <Select
            value={category}
            onValueChange={(v) =>
              setCategory(v as MarketplaceCategoryKey | 'ALL')
            }
          >
            <SelectTrigger className='bg-card h-10! w-full lg:w-44'>
              <SelectValue placeholder='All Categories' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='ALL'>All Categories</SelectItem>
              {MARKETPLACE_CATEGORIES.map((c) => (
                <SelectItem key={c.key} value={c.key}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={area}
            onValueChange={(v) => setArea(v as MarketplaceCoverage | 'ALL')}
          >
            <SelectTrigger className='bg-card h-10! w-full lg:w-40'>
              <SelectValue placeholder='All Areas' />
            </SelectTrigger>
            <SelectContent>
              {AREA_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={sort}
            onValueChange={(v) => setSort(v as MarketplaceSort)}
          >
            <SelectTrigger className='bg-card h-10! w-full lg:w-48'>
              <span className='text-muted-foreground'>Sort by:</span>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <CategoryCards selected={category} onSelect={setCategory} />

      {/* Services */}
      <div ref={servicesRef} className='scroll-mt-6 space-y-4'>
        <div className='flex items-center justify-between gap-3'>
          <h2 className='text-foreground text-lg font-bold tracking-tight'>
            {isFiltering
              ? `${services.length} ${services.length === 1 ? 'Service' : 'Services'} Found`
              : viewAll
                ? 'All Services'
                : 'Featured Services'}
          </h2>
          {isFiltering ? (
            <Button
              variant='link'
              onClick={clearFilters}
              className='h-auto p-0 text-sm'
            >
              Clear filters
            </Button>
          ) : (
            <Button
              variant='link'
              onClick={() => setViewAll((v) => !v)}
              className='h-auto p-0 text-sm'
            >
              {viewAll ? 'Show featured' : 'View all'}
            </Button>
          )}
        </div>

        {services.length > 0 ? (
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4'>
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
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

      <PopularServices onSelect={handlePopularSelect} />

      <HowItWorksDialog
        open={howItWorksOpen}
        onClose={() => setHowItWorksOpen(false)}
      />
    </div>
  );
};

export default Marketplace;
