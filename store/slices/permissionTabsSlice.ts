import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type PermissionAccessTab = 'properties' | 'mortgages';

interface PermissionAccessState {
  activeTab: PermissionAccessTab;
}

const initialState: PermissionAccessState = {
  activeTab: 'properties',
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

export const { setActiveTab } = permissionAccessTabsSlice.actions;
export default permissionAccessTabsSlice.reducer;
