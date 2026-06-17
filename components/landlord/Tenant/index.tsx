'use client';

import { Button } from '@/components/ui/button';
import { tenants } from '@/data/landlord/tenant/TenantData';
import { Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import TenantTable from './TenantTable/TenantTable';

const TenantsContainer: React.FC = () => {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return tenants;
    return tenants.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.email.toLowerCase().includes(q) ||
        t.property.toLowerCase().includes(q),
    );
  }, [search]);

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-start justify-between'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight text-gray-900 dark:text-white'>
            Tenants
          </h1>
          <p className='text-sm text-gray-500 dark:text-gray-400'>
            Manage tenant information and tenancies
          </p>
        </div>
        <Button>
          <Plus />
          Add Tenant
        </Button>
      </div>

      <TenantTable
        tenants={filtered}
        search={search}
        onSearchChange={setSearch}
      />
    </div>
  );
};

export default TenantsContainer;
