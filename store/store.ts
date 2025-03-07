import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice';
import savedItemsReducer from './slices/savedItemsSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    savedItems: savedItemsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
