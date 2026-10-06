'use client';

import CustomErrorMessage from '@/components/common/CustomErrorMessage/CustomErrorMessage';
import MarketplaceCategoryIcon from '@/components/common/MarketplaceCategoryIcon/MarketplaceCategoryIcon';
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
import { STATUS_FILTER_OPTIONS } from '@/data/super-admin/Marketplace/MarketplaceData';
import { cn } from '@/lib/utils';
import { useGetMarketplaceCategoriesQuery } from '@/store/api/endpoints/super-admin/Marketplace/MarketplaceApi';
import {
  MarketplaceApiCategory,
  MarketplaceBooleanFilter,
} from '@/types/super-admin/Marketplace/MarketplaceTypes';
import { formatDate } from '@/utils/formatters';
import {
  CircleCheck,
  CircleOff,
  FilterX,
  LayoutGrid,
  Pencil,
  Plus,
  Search,
  SearchX,
  Trash2,
  Users,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import CategoryFormDialog from './Dialogs/CategoryFormDialog';
import DeleteCategoryDialog from './Dialogs/DeleteCategoryDialog';

const Categories: React.FC = () => {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<MarketplaceBooleanFilter>('ALL');
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<MarketplaceApiCategory | null>(
    null,
  );
  const [deleteTarget, setDeleteTarget] =
    useState<MarketplaceApiCategory | null>(null);

  function clearFilters() {
    setSearch('');
    setStatus('ALL');
  }

  function openCreate() {
    setEditTarget(null);
    setFormOpen(true);
  }

  function openEdit(category: MarketplaceApiCategory) {
    setEditTarget(category);
    setFormOpen(true);
  }

  const {
    data: categories,
    isLoading,
    isError,
  } = useGetMarketplaceCategoriesQuery();

  const allCategories = useMemo(
    () =>
      [...(categories ?? [])].sort((a, b) => a.display_order - b.display_order),
    [categories],
  );

  const filteredCategories = useMemo(() => {
    const term = search.trim().toLowerCase();
    return allCategories.filter((category) => {
      if (status !== 'ALL' && String(category.is_active) !== status)
        return false;
      if (
        term &&
        ![category.name, category.slug, category.description ?? '']
          .join(' ')
          .toLowerCase()
          .includes(term)
      )
        return false;
      return true;
    });
  }, [allCategories, search, status]);

  const activeCount = allCategories.filter((c) => c.is_active).length;
  const nextDisplayOrder =
    allCategories.reduce((max, c) => Math.max(max, c.display_order), 0) + 1;
  const stats = [
    {
      label: 'Total Categories',
      value: allCategories.length,
      icon: LayoutGrid,
      className: 'bg-primary/10 text-primary',
    },
    {
      label: 'Active',
      value: activeCount,
      icon: CircleCheck,
      className:
        'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
    },
    {
      label: 'Inactive',
      value: allCategories.length - activeCount,
      icon: CircleOff,
      className: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
    },
    {
      label: 'Total Providers',
      value: allCategories.reduce((sum, c) => sum + c.provider_count, 0),
      icon: Users,
      className: 'bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400',
    },
  ];

  const isFiltering = search.trim() !== '' || status !== 'ALL';

  return (
    <div className='space-y-6'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
        <div>
          <h1 className='text-foreground flex items-center gap-2 text-2xl font-bold tracking-tight'>
            <LayoutGrid className='text-primary h-6 w-6' />
            Marketplace Categories
          </h1>
          <p className='text-muted-foreground text-sm'>
            Categories landlords use to browse marketplace providers.
          </p>
        </div>
        <Button onClick={openCreate} className='shrink-0'>
          <Plus />
          Add Category
        </Button>
      </div>

      {isError ? (
        <CustomErrorMessage title='categories' />
      ) : (
        <>
          {/* Summary */}
          <div className='grid grid-cols-2 gap-3 lg:grid-cols-4'>
            {stats.map((stat) => (
              <Card
                key={stat.label}
                className='flex-row items-center gap-3 p-4 shadow-sm'
              >
                <div
                  className={cn(
                    'flex size-10 shrink-0 items-center justify-center rounded-xl',
                    stat.className,
                  )}
                >
                  <stat.icon className='size-5' />
                </div>
                <div className='min-w-0'>
                  <p className='text-muted-foreground truncate text-xs'>
                    {stat.label}
                  </p>
                  {isLoading ? (
                    <Skeleton className='mt-1 h-6 w-10' />
                  ) : (
                    <p className='text-foreground text-xl font-bold'>
                      {stat.value}
                    </p>
                  )}
                </div>
              </Card>
            ))}
          </div>

          {/* Toolbar */}
          <div className='flex flex-col gap-3 sm:flex-row'>
            <div className='relative min-w-0 flex-1'>
              <Search className='text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2' />
              <Input
                type='text'
                placeholder='Search by name, slug or description...'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className='bg-card h-10! w-full pl-9!'
              />
            </div>
            <Select
              value={status}
              onValueChange={(v) => setStatus(v as MarketplaceBooleanFilter)}
            >
              <SelectTrigger className='bg-card h-10! w-full sm:w-44'>
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
              <Button variant='danger' onClick={clearFilters} className='h-10'>
                <FilterX />
                Clear filters
              </Button>
            )}
          </div>

          {/* Table */}
          <Card className='gap-0 overflow-hidden py-0 shadow-sm'>
            <Table>
              <TableHeader>
                <TableRow className='bg-muted/50 hover:bg-muted/50'>
                  <TableHead className='w-14 pl-4'>#</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className='hidden md:table-cell'>
                    Description
                  </TableHead>
                  <TableHead className='text-center'>Providers</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className='hidden lg:table-cell'>
                    Last Updated
                  </TableHead>
                  <TableHead className='pr-4 text-right'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell colSpan={7} className='px-4'>
                        <Skeleton className='h-10 w-full' />
                      </TableCell>
                    </TableRow>
                  ))
                ) : filteredCategories.length === 0 ? (
                  <TableRow className='hover:bg-transparent'>
                    <TableCell colSpan={7}>
                      <div className='flex flex-col items-center justify-center gap-2 py-12 text-center'>
                        <SearchX className='text-muted-foreground size-8' />
                        <p className='text-foreground font-semibold'>
                          No categories found
                        </p>
                        <p className='text-muted-foreground text-sm'>
                          {isFiltering
                            ? 'Try a different search term or status.'
                            : 'Categories will appear here once created.'}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCategories.map((category) => {
                    return (
                      <TableRow key={category.alias}>
                        <TableCell className='text-muted-foreground pl-4 font-medium'>
                          {category.display_order}
                        </TableCell>
                        <TableCell>
                          <div className='flex items-center gap-3'>
                            <MarketplaceCategoryIcon
                              icon={category.icon}
                              seed={category.alias}
                              className='size-9 rounded-lg'
                              iconClassName='size-4'
                            />
                            <div className='min-w-0'>
                              <p className='text-foreground truncate font-medium'>
                                {category.name}
                              </p>
                              <p className='text-muted-foreground truncate text-xs'>
                                {category.slug}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className='hidden max-w-xs md:table-cell'>
                          <p className='text-muted-foreground truncate text-sm'>
                            {category.description || '—'}
                          </p>
                        </TableCell>
                        <TableCell className='text-center'>
                          <span className='bg-muted text-foreground inline-flex min-w-8 justify-center rounded-full px-2 py-0.5 text-xs font-semibold'>
                            {category.provider_count}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className='flex items-center gap-1.5'>
                            <span
                              className={cn(
                                'size-2 rounded-full',
                                category.is_active
                                  ? 'bg-emerald-500'
                                  : 'bg-red-500',
                              )}
                            />
                            <span className='text-muted-foreground text-xs'>
                              {category.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className='text-muted-foreground hidden text-sm lg:table-cell'>
                          {formatDate(category.updated_at)}
                        </TableCell>
                        <TableCell className='pr-4 text-right'>
                          <div className='flex justify-end gap-1'>
                            <Button
                              variant='ghost'
                              size='icon'
                              aria-label={`Edit ${category.name}`}
                              onClick={() => openEdit(category)}
                              className='text-muted-foreground hover:text-primary size-8'
                            >
                              <Pencil className='size-4' />
                            </Button>
                            <Button
                              variant='ghost'
                              size='icon'
                              aria-label={`Delete ${category.name}`}
                              onClick={() => setDeleteTarget(category)}
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
        </>
      )}

      {formOpen && (
        <CategoryFormDialog
          open={formOpen}
          onClose={() => setFormOpen(false)}
          category={editTarget}
          nextDisplayOrder={nextDisplayOrder}
        />
      )}

      <DeleteCategoryDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        category={deleteTarget}
      />
    </div>
  );
};

export default Categories;
