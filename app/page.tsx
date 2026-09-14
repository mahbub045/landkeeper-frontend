import { authOptions } from '@/lib/auth';
import { ProfileInfo } from '@/types/common/ProfileSettings/SettingsTypes';
import { UserRole } from '@/types/next-auth';
import { getDashboardPath } from '@/utils/redirectPath';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

async function getProfileInfo(
  accessToken?: string,
): Promise<ProfileInfo | null> {
  if (!accessToken) return null;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // always get the latest subscription state
    });

    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error('Failed to fetch profile info:', error);
    return null;
  }
}

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  const userRole = session.user?.role as UserRole | undefined;
  const profileData = await getProfileInfo(session.user?.accessToken);

  const isNewUser =
    profileData?.has_subscription === false &&
    profileData?.subscription_status === null;

  const isSubscribed =
    profileData?.has_subscription === true &&
    (profileData?.subscription_status === 'ACTIVE' ||
      profileData?.subscription_status === 'TRIALING');

  if (isNewUser) {
    redirect('/client/landlord/billing-and-plans/pricing-plans');
  }

  if (userRole === 'LANDLORD' && !isSubscribed) {
    redirect('/client/landlord/billing-and-plans/billing');
  }

  redirect(getDashboardPath(userRole as UserRole));
}
