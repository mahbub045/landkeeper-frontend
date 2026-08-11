import { handleSignOut } from '@/components/SignOut';
import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react';
import { getSession } from 'next-auth/react';

export type AuthRootState = {
  auth: {
    accessToken: string | null;
  };
};

export const TAG_TYPES = [
  // Global Common Tags
  'Notifications',
  'UserProfileAndSettings',
  'SupportTickets',
  'SupportTicketComments',
  'NewJourney',

  // Common Tags
  'Property',
  'Mortgage',
  'Tenant',
  'Compliance',
  'Document',
  'Templates',
  'Finance',
  'TeamAccess',
  'PropertyMaintenance',

  // Payments
  'PaymentMethods',
  'RentPayments',
] as const;

// ─── Mutex ────────────────────────────────────────────────────────────────────
let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

// ─── Raw base query ───────────────────────────────────────────────────────────
const rawBaseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  prepareHeaders: async (headers, { getState }) => {
    // 1. localStorage (always up-to-date after refresh)
    let token =
      typeof window !== 'undefined'
        ? localStorage.getItem('accessToken')
        : null;

    // 2. Fallback → next-auth session or Redux (initial load / SSR hydration)
    if (!token) {
      const session = await getSession();
      token =
        session?.user?.accessToken ||
        (getState() as AuthRootState).auth.accessToken ||
        null;

      // Hydrate localStorage so future requests skip getSession()
      if (token && typeof window !== 'undefined') {
        localStorage.setItem('accessToken', token);
      }
    }

    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }

    return headers;
  },
});

// ─── Token refresh with mutex ─────────────────────────────────────────────────
const refreshAccessToken = async (): Promise<string | null> => {
  // concurrent 401s wait for the same refresh
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;

  refreshPromise = (async () => {
    try {
      let refreshToken: string | null =
        typeof window !== 'undefined'
          ? localStorage.getItem('refreshToken')
          : null;

      if (!refreshToken) {
        const session = await getSession();
        refreshToken = session?.user?.refreshToken ?? null;
      }

      if (!refreshToken) {
        await handleSignOut();
        return null;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/token/refresh`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh: refreshToken }),
        },
      );

      if (!response.ok) throw new Error('Refresh failed');

      const { access, refresh } = await response.json();

      // ✅ Update localStorage — prepareHeaders picks this up on retry
      if (typeof window !== 'undefined') {
        localStorage.setItem('accessToken', access);
        if (refresh) localStorage.setItem('refreshToken', refresh);
      }

      // ✅ Notify SessionSync to update next-auth session cookie
      if (typeof window !== 'undefined') {
        const channel = new BroadcastChannel('session_token_update');
        channel.postMessage({ accessToken: access, refreshToken: refresh });
        channel.close();
      }

      return access;
    } catch (error) {
      console.error('Token refresh error:', error);
      await handleSignOut();
      return null;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};

// ─── Base query with re-auth ──────────────────────────────────────────────────
const baseQueryWithReauth = async (
  args: string | FetchArgs,
  api: Parameters<BaseQueryFn>[1],
  extraOptions: Parameters<BaseQueryFn>[2],
) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    const newToken = await refreshAccessToken();

    if (newToken) {
      // prepareHeaders will automatically read the new token from localStorage
      result = await rawBaseQuery(args, api, extraOptions);
    }
  }

  return result;
};

// ─── Base API ─────────────────────────────────────────────────────────────────
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: TAG_TYPES,
  endpoints: () => ({}),
});
