import type { UserRole } from '@/types/next-auth';
import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import { getDashboardPath } from './utils/redirectPath';

const SHARED_CLIENT_PATHS = [
  '/client/profile-settings',
  '/client/notifications',
  // add other shared paths here
];

function landlordNeedsSubscription(token: {
  has_subscription?: boolean;
  subscription_status?: string;
}): boolean {
  const isSubscribed =
    token.has_subscription === true &&
    (token.subscription_status === 'ACTIVE' ||
      token.subscription_status === 'TRIALING');

  return !isSubscribed;
}

const LANDLORD_ALLOWED_PATHS_WITHOUT_SUBSCRIPTION = [
  '/client/landlord/billing-and-plans/billing',
  '/client/landlord/billing-and-plans/pricing-plans',
  '/client/profile-settings',
];

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
  function proxy(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    if (!token) {
      return NextResponse.redirect(new URL('/auth/signin', req.url));
    }

    const userRole = token.role as UserRole | undefined;

    if (
      userRole === 'LANDLORD' &&
      landlordNeedsSubscription(token) &&
      !LANDLORD_ALLOWED_PATHS_WITHOUT_SUBSCRIPTION.some((p) =>
        path.startsWith(p),
      )
    ) {
      return NextResponse.redirect(
        new URL(LANDLORD_ALLOWED_PATHS_WITHOUT_SUBSCRIPTION[0], req.url),
      );
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
