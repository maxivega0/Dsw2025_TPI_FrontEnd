import { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

// Actions
const ADD_TO_CART = 'ADD_TO_CART';
const REMOVE_FROM_CART = 'REMOVE_FROM_CART';
const UPDATE_QUANTITY = 'UPDATE_QUANTITY';
const CLEAR_CART = 'CLEAR_CART';
const LOAD_CART = 'LOAD_CART';

// Reducer
function cartReducer(state, action) {
  switch (action.type) {
    case LOAD_CART:
      return action.payload;
    
    case ADD_TO_CART:
      const existingItem = state.items.find(item => item.id === action.payload.id);
      
      if (existingItem) {
        const updatedItems = state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
        return calculateTotals({ ...state, items: updatedItems });
      } else {
        const newItems = [...state.items, action.payload];
        return calculateTotals({ ...state, items: newItems });
      }
    
    case REMOVE_FROM_CART:
      const filteredItems = state.items.filter(item => item.id !== action.payload);
      return calculateTotals({ ...state, items: filteredItems });
    
    case UPDATE_QUANTITY:
      const updatedItems = state.items.map(item =>
        item.id === action.payload.productId
          ? { ...item, quantity: Math.max(0, action.payload.quantity) }
          : item
      ).filter(item => item.quantity > 0);
      
      return calculateTotals({ ...state, items: updatedItems });
    
    case CLEAR_CART:
      return { items: [], total: 0, itemCount: 0 };
    
    default:
      return state;
  }
}

// Helper para calcular totales
function calculateTotals(cartState) {
  const total = cartState.items.reduce((sum, item) => sum + (item.currentUnitPrice * item.quantity), 0);
  const itemCount = cartState.items.reduce((sum, item) => sum + item.quantity, 0);
  
  return {
    ...cartState,
    total: parseFloat(total.toFixed(2)),
    itemCount
  };
}

export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
    itemCount: 0
  });

  // Cargar carrito desde localStorage al inicializar
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        dispatch({ type: LOAD_CART, payload: parsedCart });
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  return (
    <CartContext.Provider value={{ cart, dispatch }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);