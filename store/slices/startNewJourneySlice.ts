import { PropertyRoom } from '@/types/client/Common/Properties/PropertyTypes';
import { StartNewJourneyState } from '@/types/client/StartNewJourney/StartNewJourneyTypes';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: StartNewJourneyState = {
  isHmo: false,
  rooms: [],
};

const startNewJourneySlice = createSlice({
  name: 'startNewJourney',
  initialState,
  reducers: {
    setJourneyHmoRooms: (
      state,
      action: PayloadAction<{ isHmo: boolean; rooms: PropertyRoom[] }>,
    ) => {
      state.isHmo = action.payload.isHmo;
      state.rooms = action.payload.rooms;
    },
    resetJourneyHmoRooms: () => initialState,
  },
});

export const { setJourneyHmoRooms, resetJourneyHmoRooms } =
  startNewJourneySlice.actions;
export default startNewJourneySlice.reducer;
