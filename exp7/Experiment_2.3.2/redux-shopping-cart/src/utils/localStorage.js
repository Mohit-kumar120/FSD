const CART_STORAGE_KEY = 'redux_cart_state';

export const saveToLocalStorage = (state) => {
  try {
    const serializedState = JSON.stringify({ cart: state.cart });
    localStorage.setItem(CART_STORAGE_KEY, serializedState);
  } catch (err) {
    console.error('Error saving state to localStorage:', err);
  }
};

export const loadFromLocalStorage = () => {
  try {
    const serializedState = localStorage.getItem(CART_STORAGE_KEY);
    if (!serializedState) return undefined;
    return JSON.parse(serializedState);
  } catch (err) {
    console.error('Error loading state from localStorage:', err);
    return undefined;
  }
};

export const localStorageMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  saveToLocalStorage(store.getState());
  return result;
};
