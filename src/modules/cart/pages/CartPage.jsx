import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useCartActions } from "../hook/useCartActions"
import LoginModal from "../../auth/components/LoginModal"
import { createOrder } from "../../orders/services/order"
import useAuth from "../../auth/hook/useAuth"
import CartCard from "../components/CartCard" // Nueva importación

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
      localStorage.removeItem('cart') // Limpiar localStorage también
      alert("¡Orden creada exitosamente!")
      navigate("/") // Redirigir al listado de productos
      
    } catch (error) {
      console.error("Error processing order:", error)
      alert("Error al procesar la orden")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleLoginSuccess = () => {
    setIsLoginModalOpen(false)
    // Procesar orden automáticamente después del login
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
      <h1 className="text-3xl font-bold mb-8">Carrito de Compras</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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

        {/* Resumen del pedido */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-fit">
          <h2 className="text-xl font-bold mb-4">Resumen del Pedido</h2>
          
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <p>Productos ({cart.itemCount})</p>
              <p>${cart.total.toFixed(2)}</p>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <p>Total</p>
              <p>${cart.total.toFixed(2)}</p>
            </div>
          </div>

          <button
            onClick={handleCheckout}
            disabled={isProcessing}
            className="w-full py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isProcessing ? "Procesando..." : "Finalizar Compra"}
          </button>

          <button
            onClick={clearCart}
            className="w-full py-2 mt-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
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