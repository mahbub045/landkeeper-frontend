'use client';

import MakingTaxDigital from '@/components/client/Common/CommonComponents/MakingTaxDigital/MakingTaxDigital';
import { useLandlordAliasHeader } from '@/hooks/useLandlordAliasHeader';
import { CommonLandlordAliasProps } from '@/types/super-admin/Landlords/Overview/OverviewType';

const MtdTab: React.FC<CommonLandlordAliasProps> = ({ landlord_alias }) => {
  const isHeaderReady = useLandlordAliasHeader(landlord_alias);

  // Wait until the header is in place so the first requests carry it
  if (!isHeaderReady) return null;

  return <MakingTaxDigital />;
};

export default MtdTab;
