'use client';

import { Button } from '@/components/ui/button';
import { FilterTab } from '@/types/client/Landlord/Properties/PropertyTypes';

interface PropertyFilterProps {
  filterTabs: FilterTab[];
  activeFilter: FilterTab;
  onFilterChange: (tab: FilterTab) => void;
}

const PropertyFilter: React.FC<PropertyFilterProps> = ({
  filterTabs,
  activeFilter,
  onFilterChange,
}) => {
  return (
    <div className='flex flex-wrap items-center gap-2'>
      {filterTabs.map((tab) => (
        <Button
          key={tab}
          onClick={() => onFilterChange(tab)}
          variant={activeFilter === tab ? 'default' : 'outline'}
          size='sm'
          className='rounded-full'
        >
          {tab}
        </Button>
      ))}
    </div>
  );
};

export default PropertyFilter;
