import Card from "../../shared/components/Card";
import { FaRegTrashAlt } from "react-icons/fa";

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <img
            src={item.image || ""}
            alt={item.name}
            className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded"
          />
          <div className="flex-1">
            <h3 className="font-medium text-gray-900 text-sm sm:text-base">
              {item.name}
            </h3>
            <p className="text-gray-600 text-sm sm:text-base">
              ${item.currentUnitPrice}
            </p>
            <p className="text-xs sm:text-sm text-gray-500">SKU: {item.sku}</p>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <button
              onClick={handleDecrement}
              disabled={item.quantity <= 1}
              className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              −
            </button>
            <p className="text-sm px-1 text-center">{item.quantity}</p>
            <button
              onClick={handleIncrement}
              className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100 transition-colors"
            >
              +
            </button>
          </div>

          <div className="flex items-center gap-3">
            <p className="font-medium text-right text-sm sm:text-base">
              ${subtotal.toFixed(2)}
            </p>

            <button
              onClick={() => onRemove(item.id)}
              className="text-red-600 hover:text-red-800 transition-colors "
              title="Eliminar producto"
            >
              <FaRegTrashAlt className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default CartCard;
