'use client';

import TenantPayments from '@/components/client/Common/CommonComponents/Tenant/TenantPayments/TenantPayments';
import { useLandlordAliasHeader } from '@/hooks/useLandlordAliasHeader';
import { CommonLandlordAliasProps } from '@/types/super-admin/Landlords/Overview/OverviewType';

const TenantPaymentsTab: React.FC<CommonLandlordAliasProps> = ({
  landlord_alias,
}) => {
  const isHeaderReady = useLandlordAliasHeader(landlord_alias);

  // Wait until the header is in place so the first requests carry it
  if (!isHeaderReady) return null;

  return <TenantPayments />;
};

export default TenantPaymentsTab;
