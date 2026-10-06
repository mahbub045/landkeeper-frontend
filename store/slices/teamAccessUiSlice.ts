import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type TeamAccessTab = 'invited' | 'accepted';

interface TeamAccessUiState {
  activeTab: TeamAccessTab;
}

const initialState: TeamAccessUiState = {
  activeTab: 'invited',
};

const teamAccessUiSlice = createSlice({
  name: 'teamAccessUi',
  initialState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<TeamAccessTab>) => {
      state.activeTab = action.payload;
    },
  },
});

export const { setActiveTab } = teamAccessUiSlice.actions;
export default teamAccessUiSlice.reducer;
