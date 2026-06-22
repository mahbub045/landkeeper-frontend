import NotificationSettings from './Notificationsettings/Notificationsettings';
import ProfileSettings from './ProfileSettings/ProfileSettings';
import SubscriptionSettings from './Subscriptionsettings/Subscriptionsettings';

const ProfileSettingsContainer: React.FC = () => {
  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-foreground text-2xl font-bold tracking-tight'>
          Settings
        </h1>
        <p className='text-muted-foreground text-sm'>
          Manage your account and preferences
        </p>
      </div>

      <div className='grid grid-cols-1 gap-5 lg:grid-cols-2'>
        <ProfileSettings />
        <NotificationSettings />
      </div>

      <SubscriptionSettings />
    </div>
  );
};

export default ProfileSettingsContainer;
