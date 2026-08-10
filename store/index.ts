import { configureStore } from '@reduxjs/toolkit';
import { authApi } from './api/authApi';
import { baseApi } from './api/baseApi';
import authReducer from './slices/authSlice';
import calculatorTabsReducer, {
  CALCULATOR_TAB_STORAGE_KEY,
} from './slices/calculatorTabsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    calculatorTabs: calculatorTabsReducer,
    [baseApi.reducerPath]: baseApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware, authApi.middleware),
});

if (typeof window !== 'undefined') {
  let previousTab = store.getState().calculatorTabs.activeTab;

  store.subscribe(() => {
    const nextTab = store.getState().calculatorTabs.activeTab;

    if (nextTab !== previousTab) {
      previousTab = nextTab;
      window.localStorage.setItem(CALCULATOR_TAB_STORAGE_KEY, nextTab);
    }
  });
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
