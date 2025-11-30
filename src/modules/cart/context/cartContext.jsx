import { createContext, useContext, useReducer, useEffect } from "react";

const CartContext = createContext();

// Actions
const ADD_TO_CART = "ADD_TO_CART";
const REMOVE_FROM_CART = "REMOVE_FROM_CART";
const UPDATE_QUANTITY = "UPDATE_QUANTITY";
const CLEAR_CART = "CLEAR_CART";

// Reducer
function cartReducer(state, action) {
  switch (action.type) {
    case ADD_TO_CART: {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );

      let newItems;

      if (existingItem) {
        newItems = state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
        return calculateTotals({ ...state, items: newItems });
      } else {
        newItems = [...state.items, action.payload];
      }

      return calculateTotals({ ...state, items: newItems });
    }

    case REMOVE_FROM_CART: {
      const filteredItems = state.items.filter(
        (item) => item.id !== action.payload
      );
      return calculateTotals({ ...state, items: filteredItems });
    }

    case UPDATE_QUANTITY: {
      const updated = state.items
        .map((item) =>
          item.id === action.payload.productId
            ? { ...item, quantity: Math.max(0, action.payload.quantity) }
            : item
        )
        .filter((item) => item.quantity > 0);

      return calculateTotals({ ...state, items: updated });
    }

    case CLEAR_CART:
      return { items: [], total: 0, itemCount: 0 };

    default:
      return state;
  }
}

// Cálculo de totales
function calculateTotals(cartState) {
  const total = cartState.items.reduce(
    (sum, item) => sum + item.currentUnitPrice * item.quantity,
    0
  );

  const itemCount = cartState.items.length;

  return {
    ...cartState,
    total: parseFloat(total.toFixed(2)),
    itemCount,
  };
}

// 🔥 Nuevo: INITIALIZER — se ejecuta ANTES del primer render
function initCart() {
  try {
    const saved = localStorage.getItem("cart");
    if (!saved) return { items: [], total: 0, itemCount: 0 };

    const parsed = JSON.parse(saved);

    if (!Array.isArray(parsed.items)) throw new Error();

    return calculateTotals(parsed);
  } catch {
    return { items: [], total: 0, itemCount: 0 };
  }
}

export function CartProvider({ children }) {
  // 🧠 useReducer con initializer → NO necesita useEffect para cargar
  const [cart, dispatch] = useReducer(cartReducer, undefined, initCart);

  // Guardar carrito cuando cambie
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  return (
    <CartContext.Provider value={{ cart, dispatch }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
