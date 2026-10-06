'use client';

import Finance from '@/components/client/Common/CommonComponents/Finance/Finance';
import { useLandlordAliasHeader } from '@/hooks/useLandlordAliasHeader';
import { CommonLandlordAliasProps } from '@/types/super-admin/Landlords/Overview/OverviewType';

const FinanceTab: React.FC<CommonLandlordAliasProps> = ({ landlord_alias }) => {
  const isHeaderReady = useLandlordAliasHeader(landlord_alias);

  // Wait until the header is in place so the first requests carry it
  if (!isHeaderReady) return null;

  return <Finance />;
};

export default FinanceTab;
