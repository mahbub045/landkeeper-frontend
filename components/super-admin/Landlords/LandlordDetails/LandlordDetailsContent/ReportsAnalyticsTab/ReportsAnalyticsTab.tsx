'use client';

import ReportsAndAnalytics from '@/components/client/Common/CommonComponents/ReportsAndAnalytics/ReportsAndAnalytics';
import { useLandlordAliasHeader } from '@/hooks/useLandlordAliasHeader';
import { CommonLandlordAliasProps } from '@/types/super-admin/Landlords/Overview/OverviewType';

const ReportsAnalyticsTab: React.FC<CommonLandlordAliasProps> = ({
  landlord_alias,
}) => {
  const isHeaderReady = useLandlordAliasHeader(landlord_alias);

  // Wait until the header is in place so the first requests carry it
  if (!isHeaderReady) return null;

  return <ReportsAndAnalytics />;
};

export default ReportsAnalyticsTab;
