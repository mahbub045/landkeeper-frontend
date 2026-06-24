import ProfileCard from './ProfileCard/ProfileCard';

const SuperAdminProfileContainer: React.FC = () => {
  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-foreground text-2xl font-bold tracking-tight'>
          Profile
        </h1>
        <p className='text-muted-foreground text-sm'>
          Manage your profile information
        </p>
      </div>
      <ProfileCard />
    </div>
  );
};

export default SuperAdminProfileContainer;
