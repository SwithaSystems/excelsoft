import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItemInterface } from "./cartSlice";

interface savedForLaterItems {
  items: CartItemInterface[];
}

const initialState: savedForLaterItems = {
  items: [],
};

const savedforLaterItemsSlice = createSlice({
  name: "savedforLaterItems",
  initialState,
  reducers: {
    addToSavedForLaterItems: (
      state,
      action: PayloadAction<CartItemInterface>
    ) => {
      // console.log("Reducer received:", action.payload);

      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );
      if (!existingItem) {
        // state.items = [...state.items, action.payload];
        state.items.push(action.payload);
      }

      // console.log("Updated state after saving:", state.items);
    },
    removeFromSavedForLaterItems: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    moveToCart: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    updateSavedForLaterItemQuantity: (state, action) => {
      // console.log("Reducer received:", action.payload);
      const { id, quantity } = action.payload;
      const item = state.items.find((item) => item.id === id);
      if (item) {
        item.quantity = quantity;
      }
    },
  },
});

export const {
  addToSavedForLaterItems,
  removeFromSavedForLaterItems,
  moveToCart,
  updateSavedForLaterItemQuantity,
} = savedforLaterItemsSlice.actions;
export default savedforLaterItemsSlice.reducer;
