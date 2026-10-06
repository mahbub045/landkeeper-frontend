'use client';

import ComplianceDetails from '@/components/client/Common/CommonComponents/Compliance/ComplianceDetails/ComplianceDetails';
import { useLandlordAliasHeader } from '@/hooks/useLandlordAliasHeader';
import { useParams } from 'next/navigation';

const SuperAdminLandlordComplianceDetailsContainer: React.FC = () => {
  const { landlord_alias } = useParams<{ landlord_alias: string }>();
  const isHeaderReady = useLandlordAliasHeader(landlord_alias);

  if (!isHeaderReady) return null;

  return <ComplianceDetails />;
};

export default SuperAdminLandlordComplianceDetailsContainer;
