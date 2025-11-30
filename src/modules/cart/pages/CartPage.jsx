import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useCartActions } from "../hook/useCartActions"
import LoginModal from "../../auth/components/LoginModal"
import { createOrder } from "../../orders/services/order"
import useAuth from "../../auth/hook/useAuth"
import CartCard from "../components/CartCard"

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCartActions()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      setIsLoginModalOpen(true)
      return
    }
    
    await processOrder()
  }

  const processOrder = async () => {
    setIsProcessing(true)
    try {
      const orderData = {
        orderItems: cart.items.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          unitPrice: item.currentUnitPrice
        })),
        total: cart.total
      }

      const { data, error } = await createOrder(orderData)
      
      if (error) {
        console.error("Error creating order:", error)
        alert("Error al crear la orden: " + (error.message || "Intente nuevamente"))
        return
      }

      // Éxito - limpiar carrito y redirigir
      clearCart()
      localStorage.removeItem('cart')
      alert("¡Orden creada exitosamente!")
      navigate("/")
      
    } catch (error) {
      console.error("Error processing order:", error)
      alert("Error al procesar la orden")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleLoginSuccess = () => {
    setIsLoginModalOpen(false)
    setTimeout(() => processOrder(), 500)
  }

  if (cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Carrito de Compras</h1>
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">Tu carrito está vacío</p>
          <button 
            onClick={() => navigate("/")}
            className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            Continuar Comprando
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Carrito de Compras</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Lista de productos */}
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

        {/* Resumen del pedido - CORREGIDO */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 h-fit sticky top-4">
          <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Resumen del Pedido</h2>
          
          <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
            <div className="flex justify-between items-center">
              <p className="text-sm sm:text-base">Productos ({cart.itemCount})</p>
              <p className="text-sm sm:text-base font-medium">${cart.total.toFixed(2)}</p>
            </div>
            <div className="flex justify-between items-center font-bold text-base sm:text-lg border-t border-gray-200 pt-2 sm:pt-3">
              <p className="text-sm sm:text-base">Total</p>
              <p className="text-sm sm:text-base">${cart.total.toFixed(2)}</p>
            </div>
          </div>

          <button
            onClick={handleCheckout}
            disabled={isProcessing}
            className="w-full py-2 sm:py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
          >
            {isProcessing ? "Procesando..." : "Finalizar Compra"}
          </button>

          <button
            onClick={clearCart}
            className="w-full py-2 mt-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm sm:text-base"
          >
            Vaciar Carrito
          </button>
        </div>
      </div>

      {/* Modal de Login */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={handleLoginSuccess}
      />
    </div>
  )
}