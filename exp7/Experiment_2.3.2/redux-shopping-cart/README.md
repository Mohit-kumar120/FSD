# Experiment 2.3.2 — Redux Shopping Cart

## Aim
Implement Redux for state management in a shopping cart application.

---

## Objectives Achieved

| # | Objective | Implementation |
|---|-----------|----------------|
| 1 | Configure Redux store with Toolkit | `src/app/store.js` — configureStore with preloadedState |
| 2 | Create cart slice with reducers | `src/features/cart/cartSlice.js` — createSlice |
| 3 | Implement cart operations (add/remove/update) | addToCart, removeFromCart, updateQuantity, clearCart |
| 4 | Connect components to Redux store | useSelector, useDispatch throughout all components |
| 5 | Persist cart state to localStorage | `src/utils/localStorage.js` — custom middleware |

---

## Project Structure

```
redux-shopping-cart/
├── public/
│   └── index.html
├── src/
│   ├── app/
│   │   └── store.js               ← Redux store configuration
│   ├── features/
│   │   └── cart/
│   │       └── cartSlice.js       ← Cart slice (reducers + selectors)
│   ├── components/
│   │   ├── Header/
│   │   │   └── Header.jsx         ← AppBar with cart badge
│   │   ├── Cart/
│   │   │   └── CartDrawer.jsx     ← Side drawer with cart items
│   │   ├── ProductCard/
│   │   │   └── ProductCard.jsx    ← Product display card
│   │   └── Notification/
│   │       └── Notification.jsx   ← Redux-driven snackbar
│   ├── pages/
│   │   └── ShopPage.jsx           ← Main shop with filter/search
│   ├── utils/
│   │   ├── localStorage.js        ← Persistence middleware
│   │   └── products.js            ← Product data
│   ├── App.js                     ← Root with Provider + Theme
│   └── index.js                   ← React entry point
└── package.json
```

---

## Hardware / Software Requirements

- **React** 18+
- **Redux Toolkit** 2.0+
- **React-Redux** 9.0+
- **Material UI** 5.14+
- **Redux DevTools** browser extension (optional)

---

## Setup & Run

```bash
cd redux-shopping-cart
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000)

---

## Redux Architecture

### Store (`src/app/store.js`)
- Configured with `configureStore`
- Injects `localStorageMiddleware` for persistence
- Loads `preloadedState` from localStorage on startup

### Cart Slice (`src/features/cart/cartSlice.js`)

| Reducer | Action |
|---------|--------|
| `addToCart(product)` | Adds item or increments qty |
| `removeFromCart(id)` | Removes item by ID |
| `updateQuantity({id, quantity})` | Sets qty or removes if ≤ 0 |
| `clearCart()` | Empties the cart |
| `clearNotification()` | Dismisses toast |

### Memoized Selectors
- `selectCartItems` — all items
- `selectCartTotal` — computed price total
- `selectCartCount` — total item count
- `selectIsInCart(id)` — per-product boolean

### Persistence Middleware
- After every dispatched action, serializes `cart` state to `localStorage`
- On app start, hydrates Redux store from saved state

---

## Expected Features

- Browse 8 products across 4 categories
- Search by name or description
- Filter by category chip
- Sort by price, rating, or reviews
- Add to cart with quantity management
- Cart drawer with increment/decrement controls
- 10% auto-discount on orders over $200
- Free shipping on orders over $100
- Toast notifications for all cart actions
- State persists across page reloads

---

## About the Program

This experiment demonstrates advanced state management using **Redux Toolkit** in a real-world shopping cart scenario. Key patterns showcased:

1. **Slice pattern** — co-located reducers and action creators
2. **createSelector** — memoized derived state
3. **Custom middleware** — side-effect (localStorage) handling outside components
4. **preloadedState** — hydrating store from external source
5. **useSelector / useDispatch** — React-Redux hooks for component integration
