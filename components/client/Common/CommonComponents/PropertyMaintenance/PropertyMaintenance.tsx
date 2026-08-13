'use client';
import { useSession } from 'next-auth/react';
import PropertyMaintenanceList from './PropertyMaintenanceList/PropertyMaintenanceList';

const PropertyMaintenance: React.FC = () => {
  const { data: session } = useSession();
  return (
    <div>
      {/* <div className='mb-6'>
        <h1 className='text-foreground text-2xl font-bold tracking-tight'>
          Maintenance {session?.user?.role === 'TENANT' ? 'Requests' : ''} &
          Emergency Contacts
        </h1>
        <p className='text-muted-foreground text-sm'>
          Manage your property maintenance{' '}
          {session?.user?.role === 'TENANT' ? 'requests' : ''}
        </p>
      </div> */}
      <PropertyMaintenanceList />
    </div>
  );
};

export default PropertyMaintenance;
