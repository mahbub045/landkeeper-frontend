import CustomErrorMessage from '@/components/common/CustomErrorMessage/CustomErrorMessage';
import { useGetlandlordDetailsQuery } from '@/store/api/endpoints/super-admin/Landlords/Overview/OverviewApi';
import { OverviewTabProps } from '@/types/super-admin/Landlords/Overview/OverviewType';
import { formatChoiceFieldValue } from '@/utils/formatters';
import AccountDetails from './AccountDetails/AccountDetails';
import DeleteLandlord from './DeleteLandlord/DeleteLandlord';
import OverviewSkeleton from './OverviewSkeleton/OverviewSkeleton';
import OverviewStats from './OverviewStats/OverviewStats';
import PersonalInfo from './PersonalInfo/PersonalInfo';
import ProfileHeader from './ProfileHeader/ProfileHeader';

const OverviewTab: React.FC<OverviewTabProps> = ({ landlord_uid }) => {
  const {
    data: landlord,
    isLoading,
    isError,
  } = useGetlandlordDetailsQuery({ landlord_uid });

  if (isLoading) return <OverviewSkeleton />;
  if (isError || !landlord)
    return <CustomErrorMessage title='landlord details' />;

  const fullName = [
    formatChoiceFieldValue(landlord.title),
    landlord.first_name,
    landlord.middle_name,
    landlord.last_name,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className='space-y-6'>
      <ProfileHeader landlord={landlord} fullName={fullName} />
      <OverviewStats landlord={landlord} />
      <div className='grid gap-6 xl:grid-cols-2'>
        <PersonalInfo
          landlord={landlord}
          landlord_uid={landlord_uid}
          fullName={fullName}
        />
        <AccountDetails landlord={landlord} />
      </div>
      <DeleteLandlord
        landlord={landlord}
        landlord_uid={landlord_uid}
        fullName={fullName}
      />
    </div>
  );
};

export default OverviewTab;
