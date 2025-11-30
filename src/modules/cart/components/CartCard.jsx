import Card from "../../shared/components/Card";

function CartCard({ item, onUpdateQuantity, onRemove }) {
  const handleDecrement = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.id, item.quantity - 1);
    }
  };

  const handleIncrement = () => {
    onUpdateQuantity(item.id, item.quantity + 1);
  };

  const subtotal = item.currentUnitPrice * item.quantity;

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        {/* Información del producto */}
        <div className="flex items-center gap-4 flex-1">
          <img
            src={item.image || "/placeholder.svg?height=80&width=80"}
            alt={item.name}
            className="w-20 h-20 object-cover rounded"
          />
          <div className="flex-1">
            <h3 className="font-medium text-gray-900">{item.name}</h3>
            <p className="text-gray-600">${item.currentUnitPrice}</p>
            <p className="text-sm text-gray-500">SKU: {item.sku}</p>
          </div>
        </div>
        
        {/* Controles y acciones */}
        <div className="flex items-center gap-4">
          {/* Controles de cantidad */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleDecrement}
              disabled={item.quantity <= 1}
              className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              −
            </button>
            <span className="text-sm font-medium min-w-[20px] text-center">
              {item.quantity}
            </span>
            <button
              onClick={handleIncrement}
              className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100 transition-colors"
            >
              +
            </button>
          </div>
          
          {/* Subtotal */}
          <p className="font-medium min-w-[80px] text-right">
            ${subtotal.toFixed(2)}
          </p>
          
          {/* Botón eliminar */}
          <button
            onClick={() => onRemove(item.id)}
            className="text-red-600 hover:text-red-800 transition-colors p-1"
            title="Eliminar producto"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </Card>
  );
}

export default CartCard;