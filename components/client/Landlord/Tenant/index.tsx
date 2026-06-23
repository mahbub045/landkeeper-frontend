'use client';

import { Button } from '@/components/ui/button';
import { tenants } from '@/data/client/Landlord/tenant/TenantData';
import { Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import TenantTable from './TenantTable/TenantTable';
import AddTenantModal from './Dialogs/AddTenantModal';

const TenantsContainer: React.FC = () => {
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

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
      <div className='flex items-start justify-between'>
        <div>
          <h1 className='text-foreground text-2xl font-bold tracking-tight'>
            Tenants
          </h1>
          <p className='text-muted-foreground text-sm'>
            Manage tenant information and tenancies
          </p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus />
          Add Tenant
        </Button>
      </div>

      <TenantTable
        tenants={filtered}
        search={search}
        onSearchChange={setSearch}
      />

      <AddTenantModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => {
          setModalOpen(false);
          // refetch / invalidate RTK cache here
        }}
        properties={[]} // pass your properties array here
      />
    </div>
  );
};

export default TenantsContainer;
