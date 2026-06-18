'use client';

import { FilterTab, Property } from '@/types/landlord/Properties/PropertyTypes';
import { Home } from 'lucide-react';
import PropertyCard from '../Propertycard/Propertycard';

interface PropertyGridProps {
  properties: Property[];
  activeFilter: FilterTab;
}

const PropertyGrid: React.FC<PropertyGridProps> = ({
  properties,
  activeFilter,
}) => {
  if (properties.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-20 text-center'>
        <Home className='text-muted mb-3 size-10' />
        <p className='text-muted-foreground text-sm font-medium'>
          No properties found for &quot;{activeFilter}&quot;
        </p>
      </div>
    );
  }

  return (
    <div className='grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3'>
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
};

export default PropertyGrid;
