import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Product } from "../products/productsSlice";

export interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,

  reducers: {
    // Thêm sản phẩm
    addToCart: (state, action: PayloadAction<Product>) => {
      const product = state.items.find(
        (item) => item.id === action.payload.id
      );

      if (product) {
        product.quantity += 1;
      } else {
        state.items.push({
          ...action.payload,
          quantity: 1,
        });
      }
    },

    // Xóa sản phẩm
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(
        (item) => item.id !== action.payload
      );
    },

    // Cập nhật số lượng
    updateQuantity: (
      state,
      action: PayloadAction<{
        id: number;
        quantity: number;
      }>
    ) => {
      const product = state.items.find(
        (item) => item.id === action.payload.id
      );

      if (product) {
        product.quantity = action.payload.quantity;
      }
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
} = cartSlice.actions;

export default cartSlice.reducer;