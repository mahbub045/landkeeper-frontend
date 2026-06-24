'use client';

import { Button } from '@/components/ui/button';
import { useGetPropertiesQuery } from '@/store/api/endpoints/client/Common/Properties/PropertiesApi';

import {
  FilterTab,
  Property,
} from '@/types/client/Common/Properties/PropertyTypes';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import AddPropertyDialog from './Dialogs/AddPropertyDialog';
import PropertyFilter from './Propertyfilter/Propertyfilter';
import PropertyGrid from './PropertyGrid/PropertyGrid';

const filterTabs: FilterTab[] = [
  'All',
  'Residential',
  'HMO',
  'Commercial',
  'Occupied',
  'Vacant',
];

const Properties: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<FilterTab>('All');
  const [modalOpen, setModalOpen] = useState(false);

  const {
    data: properties = [],
    isLoading,
    isError,
  } = useGetPropertiesQuery(undefined);

  const filtered = filterProperties(properties, activeFilter);

  function filterProperties(list: Property[], tab: FilterTab) {
    if (tab === 'All') return list;
    if (tab === 'Occupied') return list.filter((p) => p.status === 'OCCUPIED');
    if (tab === 'Vacant') return list.filter((p) => p.status === 'VACANT');
    return list.filter((p) => p.property_type === tab.toUpperCase());
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
        <Button variant='default' onClick={() => setModalOpen(true)}>
          <Plus />
          Add Property
        </Button>
      </div>

      <PropertyFilter
        filterTabs={filterTabs}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      {isError ? (
        <p className='text-danger text-sm'>
          Failed to load properties. Please try again.
        </p>
      ) : (
        <PropertyGrid
          properties={filtered}
          activeFilter={activeFilter}
          isLoading={isLoading}
        />
      )}

      <AddPropertyDialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => setModalOpen(false)}
      />
    </div>
  );
};

export default Properties;
