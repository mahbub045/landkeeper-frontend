import { configureStore } from '@reduxjs/toolkit';
import { authApi } from './api/authApi';
import { baseApi } from './api/baseApi';
import authReducer from './slices/authSlice';
import calculatorTabsReducer from './slices/calculatorTabsSlice';
import teamAccessUiReducer from './slices/teamAccessUiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    calculatorTabs: calculatorTabsReducer,
    teamAccessUi: teamAccessUiReducer,
    [baseApi.reducerPath]: baseApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware, authApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
