import { configureStore } from "@reduxjs/toolkit";
import audioReducer from "./audioSlice";
import uiReducer from "./uiSlice";
import gameReducer from "./gameSlice";

export const store = configureStore({
  reducer: {
    audio: audioReducer,
    ui: uiReducer,
    game: gameReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
