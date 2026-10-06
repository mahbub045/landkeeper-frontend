'use client';

import { clearClientStorage, handleSignOut } from '@/components/SignOut';
import { getSession, useSession } from 'next-auth/react';
import { useEffect } from 'react';

export default function SessionExpiryHandler() {
  const { data: session, status } = useSession();

  // Session cookie already gone (expired while the tab was closed, or on a
  // public page) but tokens are still in storage → wipe them.
  useEffect(() => {
    if (status !== 'unauthenticated') return;
    if (
      localStorage.getItem('accessToken') ||
      localStorage.getItem('refreshToken')
    ) {
      clearClientStorage();
    }
  }, [status]);

  // Session expires while the tab is open → sign out and clear everything.
  useEffect(() => {
    if (status !== 'authenticated' || !session?.expires) return;

    const expire = async () => {
      // Another tab may have extended the session; confirm before signing out
      const current = await getSession();
      if (!current?.user) await handleSignOut();
    };

    const delay = new Date(session.expires).getTime() - Date.now();

    if (delay <= 0) {
      expire();
      return;
    }

    const timer = setTimeout(expire, delay);
    return () => clearTimeout(timer);
  }, [status, session?.expires]);

  return null;
}
