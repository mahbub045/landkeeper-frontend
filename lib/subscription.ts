import { ProfileInfo } from '@/types/common/ProfileSettings/SettingsTypes';

export function isLandlordSubscribed(
  profile?: Pick<
    ProfileInfo,
    'has_subscription' | 'subscription_status'
  > | null,
): boolean {
  return (
    profile?.has_subscription === true &&
    (profile?.subscription_status === 'ACTIVE' ||
      profile?.subscription_status === 'TRIALING')
  );
}

// True only for a landlord who has never subscribed at all — distinct from
// a landlord whose subscription lapsed/was cancelled (has_subscription may
// still be true with a non-active status in that case). New users should
// land on pricing plans; lapsed users should land on billing.
export function isNewLandlord(
  profile?: Pick<
    ProfileInfo,
    'has_subscription' | 'subscription_status'
  > | null,
): boolean {
  return (
    profile?.has_subscription === false && profile?.subscription_status === null
  );
}

export async function fetchProfileInfo(
  accessToken?: string,
): Promise<ProfileInfo | null> {
  if (!accessToken) return null;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error('Failed to fetch profile info:', error);
    return null;
  }
}
