import { configureStore } from "@reduxjs/toolkit";
import audioReducer from "./audioSlice";
import uiReducer from "./uiSlice";

export const store = configureStore({
  reducer: {
    audio: audioReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
