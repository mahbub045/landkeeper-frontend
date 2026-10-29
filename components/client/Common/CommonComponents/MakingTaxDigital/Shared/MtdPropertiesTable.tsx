'use client';

import { Home, Search } from 'lucide-react';
import { useEffect, useState } from 'react';

import Loading from '@/components/common/CustomLoader/Loading';
import HoverInfoPopover from '@/components/common/HoverInfoPopover/HoverInfoPopover';
import { Checkbox } from '@/components/ui/checkbox';
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
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  PROPERTY_STATUS_OPTIONS,
  PROPERTY_TYPE_OPTIONS,
} from '@/data/common/ChoiceFieldOptions';
import { cn } from '@/lib/utils';
import { useGetPropertiesQuery } from '@/store/api/endpoints/client/Common/Properties/PropertiesApi';
import { MtdPropertiesTableProps } from '@/types/client/Common/MakingTaxDigital/MakingTaxDigitalTypes';
import { Property } from '@/types/client/Common/Properties/PropertyTypes';
import { PAGE_LIMIT, SEARCH_DEBOUNCE_MS } from '@/utils/commonConstants.ts';
import { SectionCard, TableFrame, toAmount } from './MtdShared';

const MtdPropertiesTable: React.FC<MtdPropertiesTableProps> = ({
  rows,
  selected,
  onSelectedChange,
}) => {
  const toLabel = (options: typeof PROPERTY_TYPE_OPTIONS, value: string) =>
    options.find((opt) => opt.value === value)?.label ?? value;

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);

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

  const { data, isFetching } = useGetPropertiesQuery(queryParams);
  const properties: Property[] = data?.results ?? [];
  const totalCount = data?.count ?? 0;
  const totalPages = Math.ceil(totalCount / PAGE_LIMIT);

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

  // Income/expense totals per property; 0 until the MTD API supplies them
  const totalsFor = (alias: string) =>
    rows.find((row) => row.property.alias === alias) ?? {
      income: 0,
      expenses: 0,
      profit: 0,
    };

  const selectedCount = properties.filter((p) =>
    selected.includes(p.alias),
  ).length;
  const allSelected =
    properties.length > 0 && selectedCount === properties.length;
  const sumOf = (key: 'income' | 'expenses' | 'profit') =>
    properties
      .filter((p) => selected.includes(p.alias))
      .reduce((total, p) => total + totalsFor(p.alias)[key], 0);

  const toggle = (alias: string) =>
    onSelectedChange(
      selected.includes(alias)
        ? selected.filter((a) => a !== alias)
        : [...selected, alias],
    );
  // Selection persists across pages, so select-all only affects this page
  const pageAliases = properties.map((p) => p.alias);
  const toggleAll = () =>
    onSelectedChange(
      allSelected
        ? selected.filter((a) => !pageAliases.includes(a))
        : [...new Set([...selected, ...pageAliases])],
    );

  return (
    <SectionCard
      icon={Home}
      title='Properties included in this report'
      description='Tick the properties to include. Every tab below uses this selection.'
      action={
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
        </div>
      }
    >
      <TableFrame>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-10'>
                <Checkbox
                  aria-label='Select all properties'
                  checked={
                    allSelected
                      ? true
                      : selectedCount > 0
                        ? 'indeterminate'
                        : false
                  }
                  onCheckedChange={toggleAll}
                  className='border-primary cursor-pointer'
                />
              </TableHead>
              <TableHead>Property</TableHead>
              <TableHead>Address / country</TableHead>
              <TableHead>Property type</TableHead>
              <TableHead>Ownership share</TableHead>
              <TableHead>Letting status</TableHead>
              <TableHead>Rental income</TableHead>
              <TableHead>Allowable expenses</TableHead>
              <TableHead>Profit / (loss)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isFetching ? (
              <TableRow>
                <TableCell colSpan={9}>
                  <div className='flex justify-center py-6'>
                    <Loading />
                  </div>
                </TableCell>
              </TableRow>
            ) : properties.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className='text-muted-foreground py-6 text-center'
                >
                  No properties found.
                </TableCell>
              </TableRow>
            ) : (
              properties.map((property) => {
                const isSelected = selected.includes(property.alias);
                const totals = totalsFor(property.alias);
                return (
                  <TableRow
                    key={property.alias}
                    data-state={isSelected ? 'selected' : undefined}
                    onClick={() => toggle(property.alias)}
                    className={cn(
                      'cursor-pointer',
                      isSelected
                        ? 'bg-blue-50/40 dark:bg-blue-950/15'
                        : 'text-muted-foreground opacity-70',
                    )}
                  >
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        aria-label={`Include ${property.property_name}`}
                        checked={isSelected}
                        onCheckedChange={() => toggle(property.alias)}
                        className='border-primary cursor-pointer'
                      />
                    </TableCell>
                    <TableCell className='text-foreground font-medium'>
                      {property.property_name}
                    </TableCell>
                    <TableCell className='max-w-44 whitespace-normal'>
                      {property.address}
                    </TableCell>
                    <TableCell>
                      {toLabel(PROPERTY_TYPE_OPTIONS, property.property_type)}
                    </TableCell>
                    <TableCell>
                      {property.shareholder?.[0]?.share_percentage ?? 100}%
                    </TableCell>
                    <TableCell>
                      <span className='inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400'>
                        {toLabel(PROPERTY_STATUS_OPTIONS, property.status)}
                      </span>
                    </TableCell>
                    <TableCell className='tabular-nums'>
                      {toAmount(totals.income)}
                    </TableCell>
                    <TableCell className='tabular-nums'>
                      {toAmount(totals.expenses)}
                    </TableCell>
                    <TableCell className='font-semibold text-emerald-600 tabular-nums dark:text-emerald-400'>
                      {toAmount(totals.profit)}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
          <TableFooter className='bg-blue-50/60 dark:bg-blue-950/20'>
            <TableRow>
              <TableCell />
              <TableCell colSpan={5} className='text-foreground font-semibold'>
                Total for selected properties
              </TableCell>
              <TableCell className='font-semibold tabular-nums'>
                {toAmount(sumOf('income'))}
              </TableCell>
              <TableCell className='font-semibold tabular-nums'>
                {toAmount(sumOf('expenses'))}
              </TableCell>
              <TableCell className='font-bold text-emerald-600 tabular-nums dark:text-emerald-400'>
                {toAmount(sumOf('profit'))}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableFrame>

      <div className='flex items-center justify-between'>
        {totalCount > 0 && (
          <p className='text-muted-foreground text-sm whitespace-nowrap'>
            Showing {(page - 1) * PAGE_LIMIT + 1} to{' '}
            {Math.min(page * PAGE_LIMIT, totalCount)} of {totalCount} Properties
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
    </SectionCard>
  );
};

export default MtdPropertiesTable;
