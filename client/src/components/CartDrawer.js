import { X, Plus, Minus } from "lucide-react";

export default function CartDrawer({ isOpen, onClose, cart, removeFromCart, updateQuantity, onPlaceOrder }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-50">
      <div className="w-80 bg-white shadow-lg h-full p-4 flex flex-col">
        <div className="flex justify-between items-center border-b pb-2">
          <h2 className="text-lg font-semibold">Your Cart</h2>
          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto mt-4">
          {cart.length === 0 ? (
            <p className="text-gray-500">Your cart is empty</p>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border-b py-2"
              >
                <div className="w-12 h-12 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                  <img
                    src={item.imageUrl || 'https://via.placeholder.com/100'}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/100';
                    }}
                  />
                </div>
                <div className="flex-1 ml-3">
                  <h3 className="text-sm font-medium">{item.name}</h3>
                  <p className="text-xs text-gray-500">₹{item.price}</p>
                  <div className="flex items-center mt-1">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        updateQuantity(item.id, item.quantity - 1);
                      }}
                      className="text-gray-500 hover:text-gray-700 p-1"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="mx-2 text-sm">{item.quantity}</span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        updateQuantity(item.id, item.quantity + 1);
                      }}
                      className="text-gray-500 hover:text-gray-700 p-1"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <p className="text-sm font-medium">₹{item.price * item.quantity}</p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromCart(item.id);
                    }}
                    className="text-red-500 text-xs mt-1 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-4 border-t pt-4 flex flex-col space-y-3">
          <div className="flex justify-between font-semibold mb-2">
            <span>Total:</span>
            <span>₹{cart.reduce((total, item) => total + (item.price * item.quantity), 0)}</span>
          </div>
          
          {cart.length > 0 && (
            <>
              <button
                onClick={onPlaceOrder}
                className="w-full py-2.5 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium"
              >
                Place Order
              </button>
              <button
                onClick={() => {
                  // Empty the cart by removing all items at once
                  cart.forEach(item => removeFromCart(item.id));
                  onClose();
                }}
                className="w-full py-2 px-4 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors text-sm"
              >
                Empty Cart
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
