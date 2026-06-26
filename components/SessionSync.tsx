'use client';

import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

export function SessionSync() {
  const { update } = useSession();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const channel = new BroadcastChannel('session_token_update');

    channel.onmessage = async (
      event: MessageEvent<{
        accessToken: string;
        refreshToken: string;
      }>,
    ) => {
      await update({
        accessToken: event.data.accessToken,
        refreshToken: event.data.refreshToken,
      });
    };

    return () => channel.close();
  }, [update]);

  return null;
}
