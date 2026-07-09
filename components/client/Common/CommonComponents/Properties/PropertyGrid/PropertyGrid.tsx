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
          <Skeleton key={i} className='h-72 rounded-2xl' />
        ))}
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className='text-muted-foreground flex flex-col items-center justify-center py-20 text-center'>
        <Home className='mb-3 size-10' />
        <p className='text-sm font-medium'>No properties found</p>
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
