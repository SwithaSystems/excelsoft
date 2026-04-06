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
      // console.log("Reducer received:", action.payload);

      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );
      if (!existingItem) {
        state.items.push(action.payload);
      }

      // console.log("Updated state after saving:", state.items);
    },
    removeFromSavedItems: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    moveToCart: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    updateSavedItemQuantity: (state, action) => {
      // console.log("Reducer received:", action.payload);
      const { id, quantity } = action.payload;
      const item = state.items.find((item) => item.id === id);
      if (item) {
        item.quantity = quantity;
      }
    },
    refreshSavedItem: (
      state,
      action: PayloadAction<{ _id: string; data: Partial<CartItemInterface> }>
    ) => {
      const item = state.items.find((savedItem) => savedItem._id === action.payload._id);
      if (item) {
        Object.assign(item, action.payload.data);
      }
    },
  },
});

export const {
  addToSavedItems,
  removeFromSavedItems,
  moveToCart,
  updateSavedItemQuantity,
  refreshSavedItem,
} = savedItemsSlice.actions;
export default savedItemsSlice.reducer;
