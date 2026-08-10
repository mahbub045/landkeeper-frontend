import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export const CALCULATOR_TAB_STORAGE_KEY = 'calculator-active-tab';
export const DEFAULT_CALCULATOR_TAB: CalculatorTab = 'remortgage';

export const CALCULATOR_TAB_VALUES = [
  'remortgage',
  'stamp-duty',
  'rent-increase',
  'rental-yield',
] as const;

export type CalculatorTab = (typeof CALCULATOR_TAB_VALUES)[number];

type CalculatorTabsState = {
  activeTab: CalculatorTab;
};

export const isCalculatorTab = (value: string | null): value is CalculatorTab =>
  value !== null && CALCULATOR_TAB_VALUES.includes(value as CalculatorTab);

const initialState: CalculatorTabsState = {
  activeTab: DEFAULT_CALCULATOR_TAB,
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
