import { useState } from "react";
import { useCartActions } from "../../cart/hook/useCartActions";

export default function ProductCard({ product }) {
  const [quantity, setQuantity] = useState(0);
  const { addToCart } = useCartActions();

  const handleDecrease = () => {
    if (quantity > 0) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncrease = () => {
    setQuantity(quantity + 1);
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setQuantity(0);
    console.log(`Agregado al carrito: ${product.name}, cantidad: ${quantity}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative w-full aspect-square bg-gray-200">
        <img
          src={product.image || "/placeholder.svg?height=300&width=300"}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-4">
        <h3 className="text-sm text-gray-700 mb-2 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-lg font-semibold text-gray-900 mb-4">
          ${product.currentUnitPrice}
        </p>

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 border border-gray-300 rounded-md">
            <button
              onClick={handleDecrease}
              disabled={quantity === 0}
              className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
              aria-label="Disminuir cantidad"
            >
              −
            </button>
            <span className="text-sm font-medium min-w-[20px] text-center">
              {quantity}
            </span>
            <button
              onClick={handleIncrease}
              className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label="Aumentar cantidad"
            >
              +
            </button>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={quantity === 0}
            className="px-4 py-1.5 bg-purple-600 text-white text-sm rounded-md hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Agregar
          </button>
        </div>
      </div>
    </div>
  );
}
