'use client';

import { store } from '@/store';
import { setAccessToken } from '@/store/slices/authSlice';
import {
  CALCULATOR_TAB_STORAGE_KEY,
  DEFAULT_CALCULATOR_TAB,
  isCalculatorTab,
  setActiveTab,
} from '@/store/slices/calculatorTabsSlice';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { Provider } from 'react-redux';

function AuthSync({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();

  useEffect(() => {
    store.dispatch(setAccessToken(session?.user?.accessToken ?? null));
  }, [session?.user?.accessToken]);

  useEffect(() => {
    const storedTab = window.localStorage.getItem(CALCULATOR_TAB_STORAGE_KEY);

    if (isCalculatorTab(storedTab)) {
      store.dispatch(setActiveTab(storedTab));
      return;
    }

    window.localStorage.setItem(
      CALCULATOR_TAB_STORAGE_KEY,
      DEFAULT_CALCULATOR_TAB,
    );
  }, []);

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
