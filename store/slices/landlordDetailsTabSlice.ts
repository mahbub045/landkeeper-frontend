import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type LandlordDetailsTab =
  | 'overview'
  | 'properties'
  | 'mortgages'
  | 'tenants'
  | 'tenant-payments'
  | 'compliance'
  | 'documents'
  | 'finance'
  | 'mtd'
  | 'property-maintenance'
  | 'reports-analytics'
  | 'marketplace'
  | 'team-access'
  | 'permission';

interface LandlordDetailsUiState {
  activeTab: LandlordDetailsTab;
}

const initialState: LandlordDetailsUiState = {
  activeTab: 'overview',
};

const landlordDetailsUiSlice = createSlice({
  name: 'landlordDetailsUi',
  initialState,
  reducers: {
    setLandlordDetailsTab(state, action: PayloadAction<LandlordDetailsTab>) {
      state.activeTab = action.payload;
    },
  },
});

export const { setLandlordDetailsTab } = landlordDetailsUiSlice.actions;
export default landlordDetailsUiSlice.reducer;
