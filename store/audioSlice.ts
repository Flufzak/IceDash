import { createSlice } from "@reduxjs/toolkit";

type AudioState = {
  musicEnabled: boolean;
};

const initialState: AudioState = {
  musicEnabled: true,
};

const audioSlice = createSlice({
  name: "audio",
  initialState,
  reducers: {
    toggleMusic(state) {
      state.musicEnabled = !state.musicEnabled;
    },
    setMusic(state, action) {
      state.musicEnabled = action.payload;
    },
  },
});

export const { toggleMusic, setMusic } = audioSlice.actions;
export default audioSlice.reducer;
