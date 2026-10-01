'use client';
import { useGetlandlordDetailsQuery } from '@/store/api/endpoints/super-admin/Landlords/LandlordOverview/LandlordOverviewApi';
import { useParams } from 'next/navigation';

const SuperAdminLandlordDetailsContainer: React.FC = () => {
  const { landlord_uid } = useParams();
  const {
    data: landlord,
    isLoading,
    isError,
  } = useGetlandlordDetailsQuery({ landlord_uid });
  return <div>{/* JSX here */}</div>;
};

export default SuperAdminLandlordDetailsContainer;
