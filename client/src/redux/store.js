import { configureStore } from '@reduxjs/toolkit';
import talentReducer from './talentSlice';

export const store = configureStore({
  reducer: {
    talents: talentReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});