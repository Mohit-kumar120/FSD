import { createSlice, createSelector } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  notification: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      const existingItem = state.items.find((item) => item.id === product.id);
      if (existingItem) {
        existingItem.quantity += 1;
        state.notification = { message: `${product.name} quantity updated!`, type: 'info' };
      } else {
        state.items.push({ ...product, quantity: 1 });
        state.notification = { message: `${product.name} added to cart!`, type: 'success' };
      }
    },

    removeFromCart: (state, action) => {
      const id = action.payload;
      const item = state.items.find((i) => i.id === id);
      if (item) {
        state.notification = { message: `${item.name} removed from cart.`, type: 'error' };
      }
      state.items = state.items.filter((item) => item.id !== id);
    },

    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((i) => i.id === id);
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter((i) => i.id !== id);
          state.notification = { message: `${item.name} removed from cart.`, type: 'warning' };
        } else {
          item.quantity = quantity;
        }
      }
    },

    clearCart: (state) => {
      state.items = [];
      state.notification = { message: 'Cart cleared!', type: 'warning' };
    },

    clearNotification: (state) => {
      state.notification = null;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  clearNotification,
} = cartSlice.actions;

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectNotification = (state) => state.cart.notification;

export const selectCartTotal = createSelector(selectCartItems, (items) =>
  items.reduce((total, item) => total + item.price * item.quantity, 0)
);

export const selectCartCount = createSelector(selectCartItems, (items) =>
  items.reduce((count, item) => count + item.quantity, 0)
);

export const selectIsInCart = (productId) =>
  createSelector(selectCartItems, (items) => items.some((item) => item.id === productId));

export default cartSlice.reducer;
