import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LandlordAliasState {
  /** Sent as X-LANDLORD-ALIAS on every API request while set */
  landlordAlias: string | null;
}

const initialState: LandlordAliasState = {
  landlordAlias: null,
};

const landlordAliasSlice = createSlice({
  name: 'landlordAlias',
  initialState,
  reducers: {
    setLandlordAlias(state, action: PayloadAction<string | null>) {
      state.landlordAlias = action.payload;
    },
  },
});

export const { setLandlordAlias } = landlordAliasSlice.actions;
export default landlordAliasSlice.reducer;
