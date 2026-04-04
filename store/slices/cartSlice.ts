import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CartItemInterface {
  _id?: string;
  id: string;
  name: string;
  // discount: number;
  netPrice: number;
  quantity: number;
  isVatApplicable: boolean;
  vatRate: number;
  vatAmount: number;
  image: string | any[];
  isAgeRestricted?: boolean | "true" | "false";
  ageRestricted?: boolean | "true" | "false";
}

interface CartState {
  items: CartItemInterface[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItemInterface>) => {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push({ ...action.payload });
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    updateCartItemStock: (
      state,
      action: PayloadAction<{ id: string; availableStock: number }>
    ) => {
      const item = state.items.find((i) => i.id === action.payload.id);
      if (item && item.quantity > action.payload.availableStock) {
        item.quantity = action.payload.availableStock;
      }
    },

    updateQuantity: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>
    ) => {
      const item = state.items.find((item) => item.id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
      }
    },
    refreshCartItem: (
      state,
      action: PayloadAction<{ _id: string; data: Partial<CartItemInterface> }>
    ) => {
      const item = state.items.find((i) => i._id === action.payload._id);
      if (item) {
        Object.assign(item, action.payload.data);
      }
    },
    setCartItems: (state, action: PayloadAction<CartItemInterface[]>) => {
      state.items = action.payload;
    },

    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  refreshCartItem,
  updateCartItemStock, // Export the new action
  clearCart,
  setCartItems,
} = cartSlice.actions;
export default cartSlice.reducer;
