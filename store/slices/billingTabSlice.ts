import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type BillingTab = 'overview' | 'payment-methods' | 'billing-history';

interface BillingUiState {
  activeTab: BillingTab;
}

const initialState: BillingUiState = {
  activeTab: 'overview',
};

const billingUiSlice = createSlice({
  name: 'billingUi',
  initialState,
  reducers: {
    setActiveTab(state, action: PayloadAction<BillingTab>) {
      state.activeTab = action.payload;
    },
  },
});

export const { setActiveTab } = billingUiSlice.actions;
export default billingUiSlice.reducer;