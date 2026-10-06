'use client';

import Properties from '@/components/client/Common/CommonComponents/Properties/Properties';
import { useLandlordAliasHeader } from '@/hooks/useLandlordAliasHeader';
import { CommonLandlordAliasProps } from '@/types/super-admin/Landlords/Overview/OverviewType';

const PropertiesTab: React.FC<CommonLandlordAliasProps> = ({
  landlord_alias,
}) => {
  const isHeaderReady = useLandlordAliasHeader(landlord_alias);

  // Wait until the header is in place so the first requests carry it
  if (!isHeaderReady) return null;

  return <Properties />;
};

export default PropertiesTab;
