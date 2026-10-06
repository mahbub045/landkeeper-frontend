'use client';

import MortgageDetails from '@/components/client/Common/CommonComponents/Mortgage/MortgageDetails/MortgageDetails';
import { useLandlordAliasHeader } from '@/hooks/useLandlordAliasHeader';
import { useParams } from 'next/navigation';

const SuperAdminLandlordMortgageDetailsContainer: React.FC = () => {
  const { landlord_alias } = useParams<{ landlord_alias: string }>();
  const isHeaderReady = useLandlordAliasHeader(landlord_alias);

  if (!isHeaderReady) return null;

  return <MortgageDetails />;
};

export default SuperAdminLandlordMortgageDetailsContainer;
