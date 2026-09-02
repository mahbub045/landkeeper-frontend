import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type PermissionAccessTab = 'properties' | 'mortgages';
export type PropertiesPermissionTabKey = 'add' | 'manage';
export type MortgagesPermissionTabKey = 'add' | 'manage';

interface PermissionAccessState {
  activeTab: PermissionAccessTab;
}

interface PropertiesPermissionTabState {
  activeTab: PropertiesPermissionTabKey;
}

interface MortgagesPermissionTabState {
  activeTab: MortgagesPermissionTabKey;
}

const initialState: PermissionAccessState = {
  activeTab: 'properties',
};

const initialPropertiesPermissionTabState: PropertiesPermissionTabState = {
  activeTab: 'add',
};

const initialMortgagesPermissionTabState: MortgagesPermissionTabState = {
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

const mortgagesPermissionTabsSlice = createSlice({
  name: 'mortgagesPermissionTabs',
  initialState: initialMortgagesPermissionTabState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<MortgagesPermissionTabKey>) => {
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

export const { setActiveTab: setMortgagesPermissionActiveTab } =
  mortgagesPermissionTabsSlice.actions;
export const mortgagesPermissionTabsReducer =
  mortgagesPermissionTabsSlice.reducer;
