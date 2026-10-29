import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  MtdTabState,
  MtdTabValue,
} from '@/types/client/Common/MakingTaxDigital/MakingTaxDigitalTypes';

const initialState: MtdTabState = {
  activeTab: 'income-expenses',
};

const mtdTabSlice = createSlice({
  name: 'mtdTabs',
  initialState,
  reducers: {
    setMtdActiveTab(state, action: PayloadAction<MtdTabValue>) {
      state.activeTab = action.payload;
    },
  },
});

export const { setMtdActiveTab } = mtdTabSlice.actions;
export default mtdTabSlice.reducer;
