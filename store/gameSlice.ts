import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const gameSlice = createSlice({
  name: "game",
  initialState: { score: 0 },
  reducers: {
    setScore(state, action: PayloadAction<number>) {
      state.score = action.payload;
    },
    resetScore(state) {
      state.score = 0;
    },
  },
});

export const { setScore, resetScore } = gameSlice.actions;
export default gameSlice.reducer;
