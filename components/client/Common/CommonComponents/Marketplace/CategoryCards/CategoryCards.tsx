'use client';

import { Skeleton } from '@/components/ui/skeleton';
import MarketplaceCategoryIcon from '@/components/common/MarketplaceCategoryIcon/MarketplaceCategoryIcon';
import { cn } from '@/lib/utils';
import { CategoryCardsProps } from '@/types/super-admin/Marketplace/MarketplaceTypes';
import { useMemo } from 'react';

const CategoryCards: React.FC<CategoryCardsProps> = ({
  categories,
  isLoading,
  isError,
  selected,
  onSelect,
}) => {
  const activeCategories = useMemo(
    () =>
      (categories ?? [])
        .filter((category) => category.is_active)
        .sort((a, b) => a.display_order - b.display_order),
    [categories],
  );

  if (isLoading) {
    return (
      <div className='grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7'>
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} className='h-29 rounded-xl' />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <p className='text-muted-foreground text-sm'>
        Couldn&apos;t load categories. Please try again later.
      </p>
    );
  }

  return (
    <div className='grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7'>
      {activeCategories.map((category) => {
        const isActive = selected === category.slug;
        return (
          <button
            key={category.alias}
            type='button'
            aria-pressed={isActive}
            onClick={() => onSelect(isActive ? 'ALL' : category.slug)}
            className={cn(
              'border-border bg-card flex cursor-pointer flex-col items-start gap-3 rounded-xl border p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md',
              isActive && 'border-primary ring-primary/20 ring-2',
            )}
          >
            <MarketplaceCategoryIcon
              icon={category.icon}
              seed={category.alias}
            />
            <div className='min-w-0'>
              <p className='text-foreground text-xs font-semibold'>
                {category.name}
              </p>
              <p className='text-muted-foreground mt-1 text-xs'>
                {category.provider_count}{' '}
                {category.provider_count === 1 ? 'provider' : 'providers'}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default CategoryCards;
