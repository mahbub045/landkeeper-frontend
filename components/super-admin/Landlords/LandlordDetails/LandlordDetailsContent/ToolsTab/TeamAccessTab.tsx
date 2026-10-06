'use client';

import TeamAccess from '@/components/client/Common/CommonComponents/Tools/TeamAccess/TeamAccess';
import { useLandlordAliasHeader } from '@/hooks/useLandlordAliasHeader';
import { CommonLandlordAliasProps } from '@/types/super-admin/Landlords/Overview/OverviewType';

const TeamAccessTab: React.FC<CommonLandlordAliasProps> = ({
  landlord_alias,
}) => {
  const isHeaderReady = useLandlordAliasHeader(landlord_alias);

  // Wait until the header is in place so the first requests carry it
  if (!isHeaderReady) return null;

  return <TeamAccess />;
};

export default TeamAccessTab;
