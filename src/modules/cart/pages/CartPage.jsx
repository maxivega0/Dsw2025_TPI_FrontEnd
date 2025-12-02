import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartActions } from '../hook/useCartActions';
import LoginModal from '../../auth/components/LoginModal';
import { createOrder } from '../../orders/services/order';
import useAuth from '../../auth/hook/useAuth';
import CartCard from '../components/CartCard';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCartActions();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      setIsLoginModalOpen(true);

      return;
    }

    await processOrder();
  };

  const processOrder = async () => {
    setIsProcessing(true);
    const username = localStorage.getItem('username');

    try {
      const orderData = {
        OrderItems: cart.items.map(item => ({
          ProductId: item.id,
          Quantity: item.quantity,
          UnitPrice: item.currentUnitPrice,
        })),
        ClientUsername: username,
      };

      const { data } = await createOrder(orderData);

      console.log(data);

      clearCart();
      localStorage.removeItem('cart');
      alert('¡Orden creada exitosamente!');
      navigate('/');

    } catch (error) {
      setErrorMessage([error.response?.data?.error || 'Error al procesar la orden']);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLoginSuccess = () => {
    setIsLoginModalOpen(false);
    setTimeout(() => processOrder(), 500);
  };

  if (cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Carrito de Compras</h1>
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">Tu carrito está vacío</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            Continuar Comprando
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Carrito de Compras</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">

        <div className="lg:col-span-2 space-y-4">
          {cart.items.map(item => (
            <CartCard
              key={item.id}
              item={item}
              onUpdateQuantity={updateQuantity}
              onRemove={removeFromCart}
            />
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 h-fit sticky top-4">
          <h2 className="text-lg sm:text-xl font-bold mb-4">Resumen del Pedido</h2>

          <div className="space-y-3 mb-6">
            {cart.items.map(item => (
              <div
                key={item.id}
                className="border-b border-gray-200 pb-2 last:border-b-0"
              >
                <p className="font-semibold text-sm sm:text-base">{item.name}</p>
                <p className="text-gray-600 text-xs sm:text-sm">
                  Cantidad: <span className="font-medium">{item.quantity}</span>
                </p>
                <p className="text-gray-700 text-xs sm:text-sm text-end">
                  Subtotal:{' '}
                  <span className="font-medium">
                    ${(item.currentUnitPrice * item.quantity).toFixed(2)}
                  </span>
                </p>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center font-bold text-base sm:text-lg border-t border-gray-300 pt-4">
            <p>Total</p>
            <p>${cart.total.toFixed(2)}</p>
          </div>
          {errorMessage && <p className='text-red-500'>{errorMessage}</p>}

          <button
            onClick={handleCheckout}
            disabled={isProcessing}
            className="w-full py-2 sm:py-3 mt-4 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
          >
            {isProcessing ? 'Procesando...' : 'Finalizar Compra'}
          </button>

          <button
            onClick={clearCart}
            className="w-full py-2 mt-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm sm:text-base"
          >
            Vaciar Carrito
          </button>
        </div>
      </div>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={handleLoginSuccess}
      />
    </div>
  );
}
