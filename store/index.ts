import { configureStore } from '@reduxjs/toolkit';
import { authApi } from './api/authApi';
import { baseApi } from './api/baseApi';
import authReducer from './slices/authSlice';
import calculatorTabsReducer from './slices/calculatorTabsSlice';
import permissionAccessTabsReducer, {
  mortgagesPermissionTabsReducer,
  propertiesPermissionTabsReducer,
} from './slices/permissionTabsSlice';
import teamAccessUiReducer from './slices/teamAccessUiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    calculatorTabs: calculatorTabsReducer,
    teamAccessUi: teamAccessUiReducer,
    permissionAccessTabs: permissionAccessTabsReducer,
    propertiesPermissionTabs: propertiesPermissionTabsReducer,
    mortgagesPermissionTabs: mortgagesPermissionTabsReducer,
    [baseApi.reducerPath]: baseApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // RTK Query caches whatever a query/mutation returns in the
        // store. Some endpoints (e.g. file export/download endpoints)
        // intentionally return a Blob from their `responseHandler`,
        // which trips the default serializability check.
        ignoredActions: [
          'api/executeMutation/fulfilled',
          'api/executeQuery/fulfilled',
        ],
        ignoredPaths: [/^api\.(mutations|queries)\..*\.data$/],
      },
    }).concat(baseApi.middleware, authApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
