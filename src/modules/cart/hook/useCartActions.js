import { useCart } from '../context/CartContext';
import useAuth from '../../auth/hook/useAuth';

export const useCartActions = () => {
  const { cart, dispatch } = useCart();
  const { isAuthenticated } = useAuth();

  const addToCart = (product, quantity = 1) => {
    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        id: product.id,
        name: product.name,
        currentUnitPrice: product.currentUnitPrice,
        sku: product.sku,
        image: product.image,
        quantity: quantity
      }
    });
  };

  const removeFromCart = (productId) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
  };

  const updateQuantity = (productId, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getCartItemCount = () => {
    return cart.itemCount;
  };

  return {
    cart,
    isAuthenticated,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartItemCount
  };
};