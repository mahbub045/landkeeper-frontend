import { getSession, signOut } from 'next-auth/react';

export const handleSignOut = async () => {
  try {
    let accessToken: string | null = null;
    let refreshToken: string | null = null;

    if (typeof window !== 'undefined') {
      accessToken = localStorage.getItem('accessToken');
      refreshToken = localStorage.getItem('refreshToken');
    }

    // Fallback to session if localStorage is empty
    if (!accessToken || !refreshToken) {
      const session = await getSession();
      accessToken = accessToken || session?.user?.accessToken || null;
      refreshToken = refreshToken || session?.user?.refreshToken || null;
    }

    // Call logout API to invalidate token server-side
    if (accessToken && refreshToken) {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          refresh_token: refreshToken, // ✅ matches your API body
        }),
      }).catch((error) => {
        console.error('Logout API call failed:', error);
        // Don't block logout if API call fails
      });
    }
  } catch (error) {
    console.error('Error during logout:', error);
  } finally {
    // Always clear local data regardless of API result
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }

    await signOut({ callbackUrl: '/auth/signin' });
  }
};
