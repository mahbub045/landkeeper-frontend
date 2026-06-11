'use client';

import { store } from '@/store';
import { setAccessToken } from '@/store/slices/authSlice';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { Provider } from 'react-redux';

function AuthSync({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();

  useEffect(() => {
    store.dispatch(setAccessToken(session?.user?.accessToken ?? null));
  }, [session?.user?.accessToken]);

  return children;
}

export default function ReduxProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <AuthSync>{children}</AuthSync>
    </Provider>
  );
}
