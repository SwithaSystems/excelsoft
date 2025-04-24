import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItemInterface } from "./cartSlice";

interface SavedItemsState {
  items: CartItemInterface[];
}

const initialState: SavedItemsState = {
  items: [],
};

const savedItemsSlice = createSlice({
  name: "savedItems",
  initialState,
  reducers: {
    addToSavedItems: (state, action: PayloadAction<CartItemInterface>) => {
      console.log("Reducer received:", action.payload);

      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );
      if (!existingItem) {
        // state.items = [...state.items, action.payload];
        state.items.push(action.payload);
      }

      console.log("Updated state after saving:", state.items);
    },
    removeFromSavedItems: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    moveToCart: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
  },
});

export const { addToSavedItems, removeFromSavedItems, moveToCart } =
  savedItemsSlice.actions;
export default savedItemsSlice.reducer;
