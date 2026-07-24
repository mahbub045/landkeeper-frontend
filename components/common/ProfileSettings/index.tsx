'use client';
import { useSession } from 'next-auth/react';
import Loading from '../CustomLoader/Loading';
import NotificationSettings from './Notificationsettings/Notificationsettings';
import ProfileSettings from './ProfileSettings/ProfileSettings';
import SubscriptionSettings from './Subscriptionsettings/Subscriptionsettings';

const ProfileSettingsContainer: React.FC = () => {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className='flex h-96 items-center justify-center'>
        <Loading />
      </div>
    );
  }

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

      {session?.user?.role === 'SUPER_ADMIN' ? (
        <ProfileSettings />
      ) : (
        <>
          <div>
            <ProfileSettings />
            <NotificationSettings />
          </div>
          <SubscriptionSettings />
        </>
      )}
    </div>
  );
};

export default ProfileSettingsContainer;
