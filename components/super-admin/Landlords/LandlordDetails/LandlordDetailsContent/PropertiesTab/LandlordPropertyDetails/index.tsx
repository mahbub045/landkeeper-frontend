'use client';

import PropertyDetails from '@/components/client/Common/CommonComponents/Properties/PropertyDetails/PropertyDetails';
import { useLandlordAliasHeader } from '@/hooks/useLandlordAliasHeader';
import { useParams } from 'next/navigation';

const SuperAdminLandlordPropertyDetailsContainer: React.FC = () => {
  const { landlord_alias } = useParams<{ landlord_alias: string }>();
  const isHeaderReady = useLandlordAliasHeader(landlord_alias);

  if (!isHeaderReady) return null;

  return <PropertyDetails />;
};

export default SuperAdminLandlordPropertyDetailsContainer;
