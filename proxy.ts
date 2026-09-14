import type { UserRole } from '@/types/next-auth';
import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import { ProfileInfo } from './types/common/ProfileSettings/SettingsTypes';
import { getDashboardPath } from './utils/redirectPath';

const SHARED_CLIENT_PATHS = [
  '/client/profile-settings',
  '/client/notifications',
  // add other shared paths here
];

const LANDLORD_ALLOWED_PATHS_WITHOUT_SUBSCRIPTION = [
  '/client/landlord/billing-and-plans/billing',
  '/client/landlord/billing-and-plans/pricing-plans',
  '/client/profile-settings',
];

// Live check against the backend instead of the JWT's has_subscription/
// subscription_status, since those only refresh on explicit update() calls
// and can go stale (e.g. a webhook-driven cancellation or renewal).
// Only called for LANDLORD requests on a path outside the allowlist, so it
// doesn't add a network round trip to every single request.
async function fetchIsSubscribed(accessToken?: string): Promise<boolean> {
  if (!accessToken) return false;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!res.ok) return false;

    const profile: ProfileInfo = await res.json();
    return (
      profile.has_subscription === true &&
      (profile.subscription_status === 'ACTIVE' ||
        profile.subscription_status === 'TRIALING')
    );
  } catch (error) {
    console.error('Middleware: failed to fetch profile info:', error);
    return false; // fail closed — treat as unsubscribed on error
  }
}

function hasAccessToPath(role: UserRole | undefined, path: string): boolean {
  if (!role) return false;

  // Allow shared paths for all client roles except SUPER_ADMIN
  if (
    role !== 'SUPER_ADMIN' &&
    SHARED_CLIENT_PATHS.some((p) => path.startsWith(p))
  ) {
    return true;
  }

  const rolePathMap: Record<UserRole, string> = {
    SUPER_ADMIN: '/super-admin/',
    LANDLORD: '/client/landlord/',
    ADMIN: '/client/admin/',
    LETTING_AGENT: '/client/letting-agent/',
    MORTGAGE_ADVISER: '/client/mortgage-adviser/',
    TENANT: '/client/tenant/',
  };

  const allowedPath = rolePathMap[role];
  return allowedPath ? path.startsWith(allowedPath) : false;
}

export default withAuth(
  async function proxy(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    if (!token) {
      return NextResponse.redirect(new URL('/auth/signin', req.url));
    }

    const userRole = token.role as UserRole | undefined;
    const isOnAllowedLandlordPath =
      LANDLORD_ALLOWED_PATHS_WITHOUT_SUBSCRIPTION.some((p) =>
        path.startsWith(p),
      );

    // Only hit the profile endpoint when it can actually change the
    // outcome: landlord role, and not already on an allowed path.
    if (userRole === 'LANDLORD' && !isOnAllowedLandlordPath) {
      const isSubscribed = await fetchIsSubscribed(
        token.accessToken as string | undefined,
      );

      if (!isSubscribed) {
        return NextResponse.redirect(
          new URL(LANDLORD_ALLOWED_PATHS_WITHOUT_SUBSCRIPTION[0], req.url),
        );
      }
    }

    // Redirect root to appropriate dashboard or access denied if invalid role
    if (path === '/' || path === '') {
      return NextResponse.redirect(
        new URL(getDashboardPath(userRole), req.url),
      );
    }

    // Check if accessing wrong path
    if (!hasAccessToPath(userRole, path)) {
      return NextResponse.redirect(new URL('/auth/access-denied', req.url));
    }

    return NextResponse.next();
  },
  {
    pages: {
      signIn: '/auth/signin',
    },
  },
);

export const config = {
  matcher: ['/', '/super-admin/:path*', '/client/:path*'],
};
