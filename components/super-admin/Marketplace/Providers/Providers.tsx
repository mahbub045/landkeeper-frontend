'use client';

import MarketplacePagination from '@/components/client/Common/CommonComponents/Marketplace/MarketplacePagination/MarketplacePagination';
import CustomErrorMessage from '@/components/common/CustomErrorMessage/CustomErrorMessage';
import MarketplaceCategoryIcon from '@/components/common/MarketplaceCategoryIcon/MarketplaceCategoryIcon';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
import {
  getCategoryColor,
  STATUS_FILTER_OPTIONS,
  VERIFIED_FILTER_OPTIONS,
} from '@/data/super-admin/Marketplace/MarketplaceData';
import { cn } from '@/lib/utils';
import {
  useGetMarketplaceCategoriesQuery,
  useGetMarketplaceProvidersQuery,
} from '@/store/api/endpoints/super-admin/Marketplace/MarketplaceApi';
import {
  MarketplaceBooleanFilter,
  MarketplaceProvider,
} from '@/types/super-admin/Marketplace/MarketplaceTypes';
import { PAGE_LIMIT, SEARCH_DEBOUNCE_MS } from '@/utils/commonConstants.ts';
import { formatDate } from '@/utils/formatters';
import {
  BadgeCheck,
  FilterX,
  Mail,
  Pencil,
  Phone,
  Plus,
  Search,
  SearchX,
  Star,
  Store,
  Trash2,
} from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import DeleteProviderDialog from './Dialogs/DeleteProviderDialog';
import ProviderFormDialog from './Dialogs/ProviderFormDialog';

const COLUMN_COUNT = 7;

const Providers: React.FC = () => {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [category, setCategory] = useState('ALL');
  const [verified, setVerified] = useState<MarketplaceBooleanFilter>('ALL');
  const [status, setStatus] = useState<MarketplaceBooleanFilter>('ALL');
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<MarketplaceProvider | null>(
    null,
  );
  const [deleteTarget, setDeleteTarget] = useState<MarketplaceProvider | null>(
    null,
  );

  function openCreate() {
    setEditTarget(null);
    setFormOpen(true);
  }

  function openEdit(provider: MarketplaceProvider) {
    setEditTarget(provider);
    setFormOpen(true);
  }

  useEffect(() => {
    const timer = setTimeout(
      () => setDebouncedSearch(search.trim()),
      SEARCH_DEBOUNCE_MS,
    );
    return () => clearTimeout(timer);
  }, [search]);

  const { data: categories } = useGetMarketplaceCategoriesQuery();
  const { data, isFetching, isError } = useGetMarketplaceProvidersQuery({
    page,
    page_size: PAGE_LIMIT,
    ...(debouncedSearch && { search: debouncedSearch }),
    ...(category !== 'ALL' && { categories__slug: category }),
    ...(verified !== 'ALL' && { is_verified: verified === 'true' }),
    ...(status !== 'ALL' && { is_active: status === 'true' }),
  });

  const providers = data?.results ?? [];
  const totalCount = data?.count ?? 0;
  const isFiltering =
    search.trim() !== '' ||
    category !== 'ALL' ||
    verified !== 'ALL' ||
    status !== 'ALL';

  // Every filter change starts again from the first page.
  function clearFilters() {
    setSearch('');
    setDebouncedSearch('');
    setCategory('ALL');
    setVerified('ALL');
    setStatus('ALL');
    setPage(1);
  }

  function withPageReset<T>(setter: (value: T) => void) {
    return (value: T) => {
      setter(value);
      setPage(1);
    };
  }

  return (
    <div className='space-y-6'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
        <div>
          <h1 className='text-foreground flex items-center gap-2 text-2xl font-bold tracking-tight'>
            <Store className='text-primary h-6 w-6' />
            Marketplace Providers
          </h1>
          <p className='text-muted-foreground text-sm'>
            Companies listed in the marketplace for landlords to contact.
          </p>
        </div>

        <div className='flex items-center gap-3'>
          <Button onClick={openCreate} className='shrink-0'>
            <Plus />
            Add Provider
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <div className='flex flex-col gap-3 lg:flex-row'>
        <div className='relative min-w-0 flex-1'>
          <Search className='text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2' />
          <Input
            type='text'
            placeholder='Search by name, description or services...'
            value={search}
            onChange={(e) => withPageReset(setSearch)(e.target.value)}
            className='bg-card h-10! w-full pl-9!'
          />
        </div>

        <div className='grid grid-cols-1 gap-3 sm:grid-cols-3 lg:flex'>
          <Select value={category} onValueChange={withPageReset(setCategory)}>
            <SelectTrigger className='bg-card h-10! w-full lg:w-52'>
              <SelectValue placeholder='All Categories' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='ALL'>All Categories</SelectItem>
              {categories?.map((c) => (
                <SelectItem key={c.alias} value={c.slug}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={verified}
            onValueChange={(v) =>
              withPageReset(setVerified)(v as MarketplaceBooleanFilter)
            }
          >
            <SelectTrigger className='bg-card h-10! w-full lg:w-40'>
              <span className='text-muted-foreground'>Verified:</span>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {VERIFIED_FILTER_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={status}
            onValueChange={(v) =>
              withPageReset(setStatus)(v as MarketplaceBooleanFilter)
            }
          >
            <SelectTrigger className='bg-card h-10! w-full lg:w-40'>
              <span className='text-muted-foreground'>Status:</span>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_FILTER_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {isFiltering && (
            <Button
              variant='danger'
              onClick={clearFilters}
              className='h-10 sm:col-span-3 lg:col-span-1'
            >
              <FilterX />
              Clear filters
            </Button>
          )}
        </div>
      </div>

      {isError ? (
        <CustomErrorMessage title='providers' />
      ) : (
        <>
          <Card className='gap-0 overflow-hidden py-0 shadow-sm'>
            <Table>
              <TableHeader>
                <TableRow className='bg-muted/50 hover:bg-muted/50'>
                  <TableHead className='pl-4'>Provider</TableHead>
                  <TableHead className='hidden md:table-cell'>
                    Categories
                  </TableHead>
                  <TableHead className='hidden xl:table-cell'>
                    Contact
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className='hidden sm:table-cell'>
                    Highlights
                  </TableHead>
                  <TableHead className='hidden lg:table-cell'>
                    Last Updated
                  </TableHead>
                  <TableHead className='pr-4 text-right'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isFetching ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell colSpan={COLUMN_COUNT} className='px-4'>
                        <Skeleton className='h-12 w-full' />
                      </TableCell>
                    </TableRow>
                  ))
                ) : providers.length === 0 ? (
                  <TableRow className='hover:bg-transparent'>
                    <TableCell colSpan={COLUMN_COUNT}>
                      <div className='flex flex-col items-center justify-center gap-2 py-12 text-center'>
                        <SearchX className='text-muted-foreground size-8' />
                        <p className='text-foreground font-semibold'>
                          No providers found
                        </p>
                        <p className='text-muted-foreground text-sm'>
                          {isFiltering
                            ? 'Try a different search term or filter.'
                            : 'Providers will appear here once created.'}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  providers.map((provider) => {
                    const primaryCategory = provider.categories[0];
                    return (
                      <TableRow key={provider.alias}>
                        {/* Provider */}
                        <TableCell className='pl-4'>
                          <div className='flex items-center gap-3'>
                            {provider.logo ? (
                              <div className='border-border relative size-10 shrink-0 overflow-hidden rounded-lg border bg-white'>
                                <Image
                                  src={provider.logo}
                                  alt={provider.name}
                                  fill
                                  sizes='40px'
                                  className='object-contain p-1'
                                />
                              </div>
                            ) : (
                              <MarketplaceCategoryIcon
                                icon={primaryCategory?.icon}
                                seed={primaryCategory?.alias}
                                className='rounded-lg'
                              />
                            )}
                            <div className='min-w-0'>
                              <p className='text-foreground flex items-center gap-1 font-medium'>
                                <span className='truncate'>
                                  {provider.name}
                                </span>
                                {provider.is_verified && (
                                  <BadgeCheck
                                    aria-label='Verified provider'
                                    className='text-primary size-4 shrink-0'
                                  />
                                )}
                              </p>
                              {provider.website_url ? (
                                <a
                                  href={provider.website_url}
                                  target='_blank'
                                  rel='noopener noreferrer'
                                  className='text-muted-foreground hover:text-primary block max-w-56 truncate text-xs hover:underline'
                                >
                                  {provider.website_url.replace(
                                    /^https?:\/\/(www\.)?/,
                                    '',
                                  )}
                                </a>
                              ) : (
                                <p className='text-muted-foreground text-xs'>
                                  {provider.slug}
                                </p>
                              )}
                            </div>
                          </div>
                        </TableCell>

                        {/* Categories */}
                        <TableCell className='hidden md:table-cell'>
                          <div className='flex max-w-64 flex-wrap gap-1'>
                            {provider.categories.length > 0 ? (
                              provider.categories.map((c) => {
                                const color = getCategoryColor(c.alias);
                                return (
                                  <Badge
                                    key={c.alias}
                                    className={cn(
                                      'rounded-full border-0 px-2 text-[11px] font-medium',
                                      color.icon_bg,
                                      color.icon_color,
                                    )}
                                  >
                                    {c.name}
                                  </Badge>
                                );
                              })
                            ) : (
                              <span className='text-muted-foreground text-sm'>
                                —
                              </span>
                            )}
                          </div>
                        </TableCell>

                        {/* Contact */}
                        <TableCell className='hidden xl:table-cell'>
                          <div className='text-muted-foreground space-y-1 text-xs'>
                            {provider.contact_email && (
                              <p className='flex items-center gap-1.5'>
                                <Mail className='size-3.5 shrink-0' />
                                <span className='max-w-48 truncate'>
                                  {provider.contact_email}
                                </span>
                              </p>
                            )}
                            {provider.contact_phone && (
                              <p className='flex items-center gap-1.5'>
                                <Phone className='size-3.5 shrink-0' />
                                {provider.contact_phone}
                              </p>
                            )}
                            {!provider.contact_email &&
                              !provider.contact_phone &&
                              '—'}
                          </div>
                        </TableCell>

                        {/* Status */}
                        <TableCell>
                          <div className='flex items-center gap-1.5'>
                            <span
                              className={cn(
                                'size-2 rounded-full',
                                provider.is_active
                                  ? 'bg-emerald-500'
                                  : 'bg-red-500',
                              )}
                            />
                            <span className='text-muted-foreground text-xs'>
                              {provider.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </TableCell>

                        {/* Highlights */}
                        <TableCell className='hidden sm:table-cell'>
                          <div className='flex flex-wrap gap-1'>
                            {provider.is_verified && (
                              <Badge variant='infoLight' className='gap-1'>
                                <BadgeCheck className='size-3' />
                                Verified
                              </Badge>
                            )}
                            {provider.is_featured && (
                              <Badge variant='warningLight' className='gap-1'>
                                <Star className='size-3' />
                                Featured
                              </Badge>
                            )}
                            {!provider.is_verified && !provider.is_featured && (
                              <span className='text-muted-foreground text-sm'>
                                —
                              </span>
                            )}
                          </div>
                        </TableCell>

                        <TableCell className='text-muted-foreground hidden pr-4 text-sm lg:table-cell'>
                          {formatDate(provider.updated_at)}
                        </TableCell>

                        <TableCell className='pr-4 text-right'>
                          <div className='flex justify-end gap-1'>
                            <Button
                              variant='ghost'
                              size='icon'
                              aria-label={`Edit ${provider.name}`}
                              onClick={() => openEdit(provider)}
                              className='text-muted-foreground hover:text-primary size-8'
                            >
                              <Pencil className='size-4' />
                            </Button>
                            <Button
                              variant='ghost'
                              size='icon'
                              aria-label={`Delete ${provider.name}`}
                              onClick={() => setDeleteTarget(provider)}
                              className='text-muted-foreground hover:text-danger size-8'
                            >
                              <Trash2 className='size-4' />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </Card>

          {!isFetching && (
            <MarketplacePagination
              page={page}
              pageSize={PAGE_LIMIT}
              totalCount={totalCount}
              onPageChange={setPage}
              itemLabel='Providers'
            />
          )}
        </>
      )}

      {formOpen && (
        <ProviderFormDialog
          open={formOpen}
          onClose={() => setFormOpen(false)}
          provider={editTarget}
          nextDisplayOrder={totalCount + 1}
        />
      )}

      <DeleteProviderDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        provider={deleteTarget}
      />
    </div>
  );
};

export default Providers;
