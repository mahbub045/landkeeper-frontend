'use client';

import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

export default function SessionExpiryReload() {
  const { data: session } = useSession();

  useEffect(() => {
    if (!session?.expires) return;

    const expiresAt = new Date(session.expires).getTime();
    const delay = expiresAt - Date.now();

    if (delay <= 0) {
      window.location.reload();
      return;
    }

    const timer = setTimeout(() => {
      window.location.reload();
    }, delay);

    return () => clearTimeout(timer);
  }, [session?.expires]);

  return null;
}
