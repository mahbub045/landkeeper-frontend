import { useGetlandlordDetailsQuery } from '@/store/api/endpoints/super-admin/Landlords/LandlordOverview/LandlordOverviewApi';

const OverviewTab: React.FC<{ landlord_uid: string }> = ({ landlord_uid }) => {
  const {
    data: landlord,
    isLoading,
    isError,
  } = useGetlandlordDetailsQuery({ landlord_uid });
  return <div>{/* JSX here */}dfdsf</div>;
};

export default OverviewTab;
