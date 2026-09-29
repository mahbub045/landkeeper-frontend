'use client';

import { MARKETPLACE_CATEGORIES } from '@/data/client/common/marketplace/MarketplaceData';
import { cn } from '@/lib/utils';
import { MarketplaceCategoryKey } from '@/types/client/Common/Marketplace/MarketplaceTypes';

interface CategoryCardsProps {
  selected: MarketplaceCategoryKey | 'ALL';
  onSelect: (key: MarketplaceCategoryKey | 'ALL') => void;
}

const CategoryCards: React.FC<CategoryCardsProps> = ({
  selected,
  onSelect,
}) => {
  return (
    <div className='grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7'>
      {MARKETPLACE_CATEGORIES.map((category) => {
        const isActive = selected === category.key;
        return (
          <button
            key={category.key}
            type='button'
            aria-pressed={isActive}
            onClick={() => onSelect(isActive ? 'ALL' : category.key)}
            className={cn(
              'border-border bg-card flex cursor-pointer flex-col items-start gap-3 rounded-xl border p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md',
              isActive && 'border-primary ring-primary/20 ring-2',
            )}
          >
            <div
              className={`flex size-10 items-center justify-center rounded-xl ${category.icon_bg}`}
            >
              <category.icon className={`size-5 ${category.icon_color}`} />
            </div>
            <div className='min-w-0'>
              <p className='text-foreground text-sm font-semibold'>
                {category.label}
              </p>
              <p className='text-muted-foreground mt-1 text-xs'>
                {category.service_count} services
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default CategoryCards;
