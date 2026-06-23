'use client';

import { Button } from '@/components/ui/button';
import { properties } from '@/data/client/Landlord/properties/PropertiesData';
import {
  FilterTab,
  Property,
} from '@/types/client/Landlord/Properties/PropertyTypes';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import PropertyFilter from './Propertyfilter/Propertyfilter';
import PropertyGrid from './PropertyGrid/PropertyGrid';

const PropertiesContainer: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<FilterTab>('All');
  const filtered = filterProperties(properties, activeFilter);
  const filterTabs: FilterTab[] = [
    'All',
    'Residential',
    'HMO',
    'Commercial',
    'Occupied',
    'Vacant',
  ];

  // ── Filter logic ─────────────────────────────────────────────────────────────
  function filterProperties(list: Property[], tab: FilterTab): Property[] {
    if (tab === 'All') return list;
    if (tab === 'Occupied') return list.filter((p) => p.status === 'Occupied');
    if (tab === 'Vacant') return list.filter((p) => p.status === 'Vacant');
    return list.filter((p) => p.type === tab.toLowerCase());
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-start justify-between'>
        <div>
          <h1 className='text-foreground text-2xl font-bold tracking-tight'>
            Properties
          </h1>
          <p className='text-muted-foreground text-sm'>
            Manage your property portfolio
          </p>
        </div>
        <Button variant='default'>
          <Plus />
          Add Property
        </Button>
      </div>

      <PropertyFilter
        filterTabs={filterTabs}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      <PropertyGrid properties={filtered} activeFilter={activeFilter} />
    </div>
  );
};

export default PropertiesContainer;
