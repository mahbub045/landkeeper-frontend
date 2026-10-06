'use client';

import Tenants from '@/components/client/Common/CommonComponents/Tenant/Tenants/Tenants';
import { useLandlordAliasHeader } from '@/hooks/useLandlordAliasHeader';
import { CommonLandlordAliasProps } from '@/types/super-admin/Landlords/Overview/OverviewType';

const TenantsTab: React.FC<CommonLandlordAliasProps> = ({ landlord_alias }) => {
  const isHeaderReady = useLandlordAliasHeader(landlord_alias);

  // Wait until the header is in place so the first requests carry it
  if (!isHeaderReady) return null;

  return <Tenants />;
};

export default TenantsTab;
