import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type PermissionAccessTab = 'properties' | 'mortgages';
export type PropertiesPermissionTabKey = 'add' | 'manage';

interface PermissionAccessState {
  activeTab: PermissionAccessTab;
}

interface PropertiesPermissionTabState {
  activeTab: PropertiesPermissionTabKey;
}

const initialState: PermissionAccessState = {
  activeTab: 'properties',
};

const initialPropertiesPermissionTabState: PropertiesPermissionTabState = {
  activeTab: 'add',
};

const permissionAccessTabsSlice = createSlice({
  name: 'permissionAccessTabs',
  initialState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<PermissionAccessTab>) => {
      state.activeTab = action.payload;
    },
  },
});

const propertiesPermissionTabsSlice = createSlice({
  name: 'propertiesPermissionTabs',
  initialState: initialPropertiesPermissionTabState,
  reducers: {
    setActiveTab: (
      state,
      action: PayloadAction<PropertiesPermissionTabKey>,
    ) => {
      state.activeTab = action.payload;
    },
  },
});

export const { setActiveTab } = permissionAccessTabsSlice.actions;
export default permissionAccessTabsSlice.reducer;

export const { setActiveTab: setPropertiesPermissionActiveTab } =
  propertiesPermissionTabsSlice.actions;
export const propertiesPermissionTabsReducer =
  propertiesPermissionTabsSlice.reducer;
