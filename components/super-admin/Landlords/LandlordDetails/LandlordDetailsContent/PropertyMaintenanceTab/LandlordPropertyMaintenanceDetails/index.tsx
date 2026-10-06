'use client';

import PropertyMaintenanceDetails from '@/components/client/Common/CommonComponents/PropertyMaintenance/PropertyMaintenanceDetails/PropertyMaintenanceDetails';
import { useLandlordAliasHeader } from '@/hooks/useLandlordAliasHeader';
import { useParams } from 'next/navigation';

const SuperAdminLandlordPropertyMaintenanceDetailsContainer: React.FC = () => {
  const { landlord_alias } = useParams<{ landlord_alias: string }>();
  const isHeaderReady = useLandlordAliasHeader(landlord_alias);

  if (!isHeaderReady) return null;

  return <PropertyMaintenanceDetails />;
};

export default SuperAdminLandlordPropertyMaintenanceDetailsContainer;
