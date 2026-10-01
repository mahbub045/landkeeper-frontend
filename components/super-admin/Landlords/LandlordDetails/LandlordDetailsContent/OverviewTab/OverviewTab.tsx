import CustomErrorMessage from '@/components/common/CustomErrorMessage/CustomErrorMessage';
import { useGetlandlordDetailsQuery } from '@/store/api/endpoints/super-admin/Landlords/Overview/OverviewApi';
import { formatChoiceFieldValue } from '@/utils/formatters';
import AccountDetails from './AccountDetails/AccountDetails';
import OverviewSkeleton from './OverviewSkeleton/OverviewSkeleton';
import OverviewStats from './OverviewStats/OverviewStats';
import PersonalInfo from './PersonalInfo/PersonalInfo';
import ProfileHeader from './ProfileHeader/ProfileHeader';

const OverviewTab: React.FC<{ landlord_uid: string }> = ({ landlord_uid }) => {
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
        <PersonalInfo landlord={landlord} fullName={fullName} />
        <AccountDetails landlord={landlord} />
      </div>
    </div>
  );
};

export default OverviewTab;
