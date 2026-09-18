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
      clearClientStorage();
    }

    await signOut({ callbackUrl: '/auth/signin' });
  }
};

const clearClientStorage = () => {
  // Preserve theme preference, clear everything else in localStorage
  const theme = localStorage.getItem('theme');
  localStorage.clear();
  if (theme !== null) {
    localStorage.setItem('theme', theme);
  }

  sessionStorage.clear();

  // Clear all cookies accessible to JS
  document.cookie.split(';').forEach((cookie) => {
    const name = cookie.split('=')[0].trim();
    if (!name) return;
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
  });

  // Clear Shared Storage API, if available
  const sharedStorage = (window as Window & { sharedStorage?: { clear: () => Promise<void> } })
    .sharedStorage;
  if (sharedStorage) {
    sharedStorage.clear().catch(() => {});
  }
};
