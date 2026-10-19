'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { PropertyGridProps } from '@/types/client/Common/Properties/PropertyTypes';
import { Home } from 'lucide-react';
import PropertyCard from './PropertyCard/PropertyCard';

const PropertyGrid: React.FC<PropertyGridProps> = ({
  properties,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className='grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3'>
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton
            key={i}
            className='h-72 rounded-2xl bg-white shadow-sm dark:bg-[#262626]'
          />
        ))}
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className='bg-card flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed px-6 py-16 text-center'>
        <div className='bg-primary/10 ring-primary/5 flex size-16 items-center justify-center rounded-full ring-8'>
          <Home className='text-primary size-7' />
        </div>
        <div className='space-y-1'>
          <p className='text-foreground text-base font-semibold'>
            No properties found
          </p>
          <p className='text-muted-foreground max-w-sm text-sm'>
            There are no properties to show yet. Try a different search or
            filter, or add a property to start building your portfolio.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3'>
      {properties.map((property) => (
        <PropertyCard key={property.alias} property={property} />
      ))}
    </div>
  );
};

export default PropertyGrid;
