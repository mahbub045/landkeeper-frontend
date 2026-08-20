import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type CalculatorTab =
  | 'remortgage'
  | 'stamp-duty'
  | 'rent-increase'
  | 'rental-yield';

type CalculatorTabsState = {
  activeTab: CalculatorTab;
};

const initialState: CalculatorTabsState = {
  activeTab: 'remortgage',
};

const calculatorTabsSlice = createSlice({
  name: 'calculatorTabs',
  initialState,
  reducers: {
    setActiveTab(state, action: PayloadAction<CalculatorTab>) {
      state.activeTab = action.payload;
    },
  },
});

export const { setActiveTab } = calculatorTabsSlice.actions;
export default calculatorTabsSlice.reducer;
