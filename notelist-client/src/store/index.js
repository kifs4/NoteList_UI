import { configureStore } from '@reduxjs/toolkit'; // Оце правильний імпорт!
import authReducer from './authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});