import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    snowEnabled: false,
  },
  reducers: {
    setSnowEnabled(state, action) {
      state.snowEnabled = action.payload;
    },
  },
});

export const { setSnowEnabled } = uiSlice.actions;
export default uiSlice.reducer;
