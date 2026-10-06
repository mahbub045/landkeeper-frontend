'use client';

import PropertyMaintenance from '@/components/client/Common/CommonComponents/PropertyMaintenance/PropertyMaintenance';
import { useLandlordAliasHeader } from '@/hooks/useLandlordAliasHeader';
import { CommonLandlordAliasProps } from '@/types/super-admin/Landlords/Overview/OverviewType';

const PropertyMaintenanceTab: React.FC<CommonLandlordAliasProps> = ({
  landlord_alias,
}) => {
  const isHeaderReady = useLandlordAliasHeader(landlord_alias);

  // Wait until the header is in place so the first requests carry it
  if (!isHeaderReady) return null;

  return <PropertyMaintenance />;
};

export default PropertyMaintenanceTab;
