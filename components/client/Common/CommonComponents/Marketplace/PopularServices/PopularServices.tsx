'use client';

import { POPULAR_SERVICES } from '@/data/client/common/marketplace/MarketplaceData';
import { ChevronRight } from 'lucide-react';

const PopularServices: React.FC<{ onSelect: (search: string) => void }> = ({
  onSelect,
}) => {
  return (
    <div className='space-y-4'>
      <div>
        <h2 className='text-foreground text-lg font-bold tracking-tight'>
          Popular Services
        </h2>
        <p className='text-muted-foreground text-sm'>
          Quick links to the most in-demand services for landlords.
        </p>
      </div>

      <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4'>
        {POPULAR_SERVICES.map((item) => (
          <button
            key={item.label}
            type='button'
            onClick={() => onSelect(item.search)}
            className='border-border bg-card group flex cursor-pointer items-center gap-3 rounded-xl border p-4 text-left shadow-sm transition-all hover:shadow-md'
          >
            <div
              className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${item.icon_bg}`}
            >
              <item.icon className={`size-5 ${item.icon_color}`} />
            </div>
            <div className='min-w-0 flex-1'>
              <p className='text-foreground truncate text-sm font-semibold'>
                {item.label}
              </p>
              <p className='text-muted-foreground truncate text-xs'>
                {item.description}
              </p>
            </div>
            <ChevronRight className='text-muted-foreground size-4 shrink-0 transition-transform group-hover:translate-x-0.5' />
          </button>
        ))}
      </div>
    </div>
  );
};

export default PopularServices;
