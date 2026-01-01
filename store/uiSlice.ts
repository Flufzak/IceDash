import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    snowEnabled: false,
    splashDone: false,
  },
  reducers: {
    setSnowEnabled(state, action) {
      state.snowEnabled = action.payload;
    },
    setSplashDone(state, action) {
      state.splashDone = action.payload;
    },
  },
});

export const { setSnowEnabled, setSplashDone } = uiSlice.actions;
export default uiSlice.reducer;
